import PreprocessedPersonRelationsScanner from "./PreprocessedPersonRelationsScanner";
import {PreProcessedPerson} from "../../model/human/person/Person";
import PersonResponseDto, {
    NestedPersonResponseDto,
    NestedRelationshipsInfo,
    RelatedPersonResponseDto
} from "../../rest/dto/person/PersonResponseDto";
import {EmbedJurPersonResponseDto} from "../../rest/dto/jurPerson/JurPersonResponseDto";
import checkJurPersonDto from "../../util/checkJurPersonDto";

type JurPersonsContainable = Pick<RelatedPersonResponseDto, "id"|"benOwnedJurPersons"|"ownedJurPersons">

type BranchScan = Map<NestedPersonResponseDto, Set<number>>

export default class PreprocessedPersonRelationsScannerImpl implements PreprocessedPersonRelationsScanner {
    public static getInstance(): PreprocessedPersonRelationsScannerImpl {
        return new PreprocessedPersonRelationsScannerImpl()
    }
    private countRepeats (data: BranchScan): Map<number, number> {
        const repeatMap: Map<number, number> = new Map();

        [...data.values()].forEach(scanned=>{
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

        const shared: Set<number> = new Set([person.id]);

        const rootPersons: RelatedPersonResponseDto[] = tree.map(r=>r.person);

        const branchesScanned: BranchScan = new Map;

        if (limit>0||limit===-1) {
            rootPersons.forEach(p=>{
                const res = this.recursiveScan(p, limit);
                branchesScanned.set(p, res);
            });
        }

        if (limit>0||limit===-1) {
            rootPersons.forEach(p=>shared.add(p.id))
            const jpContainable = [...rootPersons, person];
            jpContainable
                .forEach(p=>{
                    [...p.benOwnedJurPersons, ...p.ownedJurPersons].forEach(jurPerson=>{
                        if (checkJurPersonDto(jurPerson)) {
                            const owner = jurPerson.owner;
                            if (owner&&![...branchesScanned.keys()].some(p=>p.id===owner.id)) {
                                const branchData = this.recursiveScan(p, limit);
                                branchesScanned.set(p, branchData);
                            }

                            const benOwner = jurPerson.benOwner;
                            if (benOwner&&![...branchesScanned.keys()].some(p=>p.id===benOwner.id)) {
                                const branchData = this.recursiveScan(p, limit);
                                branchesScanned.set(p, branchData);
                            }
                        }
                    })
                });
        }

        branchesScanned.forEach(idSet=>idSet.forEach(id=>scannedPersons.add(id)));

        const repeats = new Set([...this.countRepeats(branchesScanned).entries()]
            .filter(([_id, repeats])=>{
                return repeats>0;
            }).map(e=>e[0]));

        [...branchesScanned.entries()].forEach(([p, scannedSet])=>{
            if ([...repeats].some(id=>scannedPersons.has(id))) {
                this.scanForMiddlePersons(repeats, p,shared,limit, 1)
            }
        })
        console.log(shared)
        return {all: scannedPersons, shared: shared};
    }

    private scanForMiddlePersons(duplicateSet: Set<number>, nestedPerson: NestedPersonResponseDto,
                              shared: Set<number>, limit: number, counter: number, subBranchScanned: Set<number> = new Set([nestedPerson.id])) {
        if (duplicateSet.has(nestedPerson.id)) {
            subBranchScanned.forEach(s=>shared.add(s));
        }

        nestedPerson.relationshipsInfo.relationships?.forEach(r=>{
            if (limit===-1||limit>counter) {
                const newSubBranchScanned = new Set([...subBranchScanned, r.person.id]);
                this.scanForMiddlePersons(duplicateSet, r.person, shared, limit, counter+1, newSubBranchScanned);
            }
        })
    }

    private recursiveScan(person: NestedPersonResponseDto, limit: number, counter=1): Set<number> {
        const result: Set<number> = new Set;

        result.add(person.id);

        person.relationshipsInfo.relationships?.forEach(relation=>{
            const nestedRelations = this.recursiveScan(relation.person, limit, counter+1);
            nestedRelations.forEach(n=>result.add(n));
        })

        return result;
    }


}