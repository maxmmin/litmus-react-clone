import PreprocessedPersonRelationsScanner from "./PreprocessedPersonRelationsScanner";
import {PreProcessedPerson} from "../../model/human/person/Person";
import PersonResponseDto, {
    NestedRelationshipsInfo,
    RelatedPersonResponseDto
} from "../../rest/dto/person/PersonResponseDto";
import {EmbedJurPersonResponseDto} from "../../rest/dto/jurPerson/JurPersonResponseDto";
import checkJurPersonDto from "../../util/checkJurPersonDto";

type JurPersonsContainable = Pick<RelatedPersonResponseDto, "id"|"benOwnedJurPersons"|"ownedJurPersons">

export default class PreprocessedPersonRelationsScannerImpl implements PreprocessedPersonRelationsScanner {
    public static getInstance(): PreprocessedPersonRelationsScannerImpl {
        return new PreprocessedPersonRelationsScannerImpl()
    }
    private countRepeats (data: Set<number>[]): Map<number, number> {
        const repeatMap: Map<number, number> = new Map();

        data.forEach(scanned=>{
            scanned.forEach(n=>{
                if (!repeatMap.has(n)) {
                    repeatMap.set(n, 0)
                } else {
                    const currentValue = repeatMap.get(n)!;
                    repeatMap.set(n, currentValue+1)
                }
            })
        })

        return repeatMap;
    }
    scan(person: PreProcessedPerson, limit: number): { shared: Set<number>; all: Set<number> } {
        const tree = person.relationshipsInfo.relationships||[];

        const scannedPersons: Set<number> = new Set([person.id]);

        const duplicatedPersons: Set<number> = new Set([person.id]);

        const rootPersons: RelatedPersonResponseDto[] = tree.map(r=>r.person);

        const branchesScanned: Set<number>[] = rootPersons.map(p=>{
            const res = this.recursiveScan(p.relationshipsInfo, limit);
            if (limit>0||limit===-1) {
                res.add(p.id);
            }
            return res;
        });

        if (limit>0||limit===-1) {
            rootPersons.forEach(p=>duplicatedPersons.add(p.id))
            const jpContainable = [...rootPersons, person];
            const scans: Set<number>[] = jpContainable
                .map(p=>this.scanJurPersons(p, limit));
            branchesScanned.push(...scans);
        }

        const repeats = this.countRepeats(branchesScanned);

        const shared = [...repeats.entries()].filter(([_id, repeats])=>{
            return repeats>1;
        }).map(e=>e[0]);

        shared.forEach(id=>duplicatedPersons.add(id));

        return {all: scannedPersons, shared: duplicatedPersons};
    }

    private recursiveScan(nestedRelationships: NestedRelationshipsInfo, limit: number, counter=1): Set<number> {
        const relations = nestedRelationships.relationships?.map(r=>r.person)||[];
        const result: Set<number> = new Set;

        relations.forEach(relation=>{
            result.add(relation.id)
            const nestedRelations = this.recursiveScan(relation.relationshipsInfo, limit, counter+1);
            nestedRelations.forEach(n=>result.add(n));
        })

        return result;
    }

    private scanJurPersons(mainEntity: JurPersonsContainable, limit: number): Set<number> {
        const ownedJurPersons = mainEntity.ownedJurPersons;
        const benOwnedJurPersons = mainEntity.benOwnedJurPersons;
        const ownedScanSet = ownedJurPersons.reduce((acc,jurPerson)=>{
            let scanned: Set<number>
            if (checkJurPersonDto(jurPerson)) {
                scanned = this.scanJurPerson(jurPerson, limit);
            } else scanned = new Set;
            return new Set([...scanned, ...acc]);
        }, new Set<number>)
        const benOwnedSet = benOwnedJurPersons.reduce((acc,jurPerson)=>{
            let scanned: Set<number>
            if (checkJurPersonDto(jurPerson)) {
                scanned = this.scanJurPerson(jurPerson, limit);
            } else scanned = new Set;
            return new Set([...scanned, ...acc]);
        }, new Set<number>)
        return new Set([...ownedScanSet, ...benOwnedSet])
    }

    private scanJurPerson(mainEntity: EmbedJurPersonResponseDto, limit: number): Set<number> {
        const owner = mainEntity.owner;
        const benOwner = mainEntity.benOwner;

        const res: Set<number> = new Set<number>();

        if (owner) {
            const relations = this.recursiveScan(owner.relationshipsInfo, limit);
            relations.add(owner.id);
            relations.forEach(r=>res.add(r));
        }

        if (benOwner) {
            const relations = this.recursiveScan(benOwner.relationshipsInfo, limit);
            relations.add(benOwner.id);
            relations.forEach(r=>res.add(r));
        }

        return res;
    }

}