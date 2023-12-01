import PreprocessedPersonRelationsScanner from "./PreprocessedPersonRelationsScanner";
import {PreProcessedPerson} from "../../model/human/person/Person";
import {
    NestedPersonResponseDto,
    RelatedPersonResponseDto
} from "../../rest/dto/person/PersonResponseDto";
import checkJurPersonDto from "../../util/jurPerson/checkJurPersonDto";

type Relation = {
    from: number|null,
    to: number
}

class ScanRelationsSet {
    // from, toArray
    private readonly scanMap: Map<number|null, Set<number>> = new Map;

    addRelation(from: number|null, to: number) {
        if (!this.scanMap.has(from)) {
            this.scanMap.set(from, new Set);
        }
        const numberSet: Set<number> = this.scanMap.get(from)!;
        numberSet.add(to);
    }

    getRelations(): Relation[] {
        const relations: Relation[] = [];

        [...this.scanMap.entries()].forEach(([from, to])=>{
            to.forEach(toId=>{
                relations.push({
                    from: from,
                    to: toId
                })
            })
        })

        return relations;
    }

    getToRelations(to: number): Relation[] {
        const relations: Relation[] = [];
        [...this.scanMap.entries()].forEach(([from, toSet])=>{
            if (toSet.has(to)) {
                const r: Relation = {
                    from: from,
                    to: to
                }
                relations.push(r);
            }
        })
        return relations;
    }
}

class ScanRelationsSetUtil {
    public extractPersonIds(branchSet: ScanRelationsSet): Set<number> {
        const idSet: Set<number> = new Set<number>();
        branchSet.getRelations().forEach(r=>{
            idSet.add(r.to);
            if (r.from!==null) {
                idSet.add(r.from);
            }
        })
        return idSet;
    }
    public getDuplicatedPersonsIds (branchSets: ScanRelationsSet[]): Set<number> {
        const relations = this.getSharedRelations(branchSets);
        const ids: Set<number> = new Set;
        relations.forEach(({ to})=>{
            ids.add(to);
        })
        return ids;
    }
    public getSharedRelations (branchSets: ScanRelationsSet[]): Relation[] {
        const shared: Relation[] = [];

        branchSets.forEach(set => {
            const setSharedRelations: Relation[] = set.getRelations()
                .filter(r => {
                    for (const currentSet of branchSets) {
                        if (currentSet!==set) {
                            const relations = currentSet.getToRelations(r.to).filter(nestedR=>nestedR.from!==r.from);
                            return relations.length>0;
                        }
                    }
                    return false;
            })

            shared.push(...setSharedRelations);
        })

        return shared;
    }

}

export default class PreprocessedPersonRelationsScannerImpl implements PreprocessedPersonRelationsScanner {
    private scanRelationsSetUtil: ScanRelationsSetUtil = new ScanRelationsSetUtil();
    public static getInstance(): PreprocessedPersonRelationsScannerImpl {
        return new PreprocessedPersonRelationsScannerImpl()
    }

    scan(person: PreProcessedPerson, limit: number): { shared: Set<number>; all: Set<number> } {
        const tree = person.relationshipsInfo.relationships||[];

        const scannedPersons: Set<number> = new Set([person.id]);

        const shared: Set<number> = new Set([person.id]);

        const rootPersons: RelatedPersonResponseDto[] = tree.map(r=>r.person);

        const scanSets: ScanRelationsSet[] = []

        if (limit>0||limit===-1) {
            rootPersons.forEach(p=>{
                const targetScanSet = new ScanRelationsSet();
                this.scanPerson(p, targetScanSet, limit);
                shared.add(p.id)
                scanSets.push(targetScanSet);
            });

            const jpContainable = [...rootPersons, person];
            jpContainable
                .forEach(p=>{
                    [...p.benOwnedJurPersons, ...p.ownedJurPersons].forEach(jurPerson=>{
                        if (checkJurPersonDto(jurPerson)) {
                            const owner = jurPerson.owner;
                            if (owner&&![...rootPersons, person].some(p=>p.id===owner.id)) {
                                const targetScanSet = new ScanRelationsSet();
                                this.scanPerson(owner, targetScanSet, limit, 1);
                                scanSets.push(targetScanSet);
                            }

                            const benOwner = jurPerson.benOwner;
                            if (benOwner&&![...rootPersons, person].some(p=>p.id===benOwner.id)) {
                                const targetScanSet = new ScanRelationsSet();
                                this.scanPerson(benOwner, targetScanSet, limit, 1);
                                scanSets.push(targetScanSet);
                            }
                        }
                    })
                });
        }

        const sharedRelations: Set<number> = this.scanRelationsSetUtil.getDuplicatedPersonsIds(scanSets);

        sharedRelations.forEach(r=>{
            shared.add(r);
        });

        const targetMiddleSet: Set<number> = new Set;
        this.loadMiddlePersonsFromRoot(targetMiddleSet,new Set(shared),person, limit, 0);
        targetMiddleSet.forEach(id=>shared.add(id));

        const scannedRelations: Set<number> = scanSets.reduce((acc, set)=>{
            const idSet = this.scanRelationsSetUtil.extractPersonIds(set);
            return new Set([...idSet, ...acc]);
        }, new Set<number>)

        scannedRelations.forEach(r=>{
            scannedPersons.add(r);
        })

        return {all: scannedPersons, shared: shared};
    }

    private loadMiddlePersonsFromRoot(targetSet: Set<number>, personsToFind: Set<number>, scanPerson: NestedPersonResponseDto,
                                         limit: number, counter: number): void {
        const jpContainable = [scanPerson, ...scanPerson.relationshipsInfo.relationships?.map(r=>r.person)||[]];

        personsToFind.forEach(id=>{
            this.loadMiddlePersonsIdFromNested(targetSet,id,scanPerson,limit,counter);

            jpContainable.forEach(jp=>{
                if (checkJurPersonDto(jp)) {
                    const owner = jp.owner;
                    if (owner&&!scanPerson.relationshipsInfo.relationships?.some(r=>r.person.id===owner.id)) {
                        this.loadMiddlePersonsIdFromNested(targetSet,id,owner,limit,counter);
                    }
                    const benOwner = jp.benOwner;
                    if (benOwner&&!scanPerson.relationshipsInfo.relationships?.some(r=>r.person.id===benOwner.id)) {
                        this.loadMiddlePersonsIdFromNested(targetSet,id,benOwner,limit,counter);
                    }
                }
            })
        });
    }

    private loadMiddlePersonsIdFromNested(targetSet: Set<number>, personToFind: number, scanPerson: NestedPersonResponseDto,
                                limit: number, counter: number, subBranchScanned: Set<number> = new Set) {
        subBranchScanned.add(scanPerson.id);

        if (personToFind===scanPerson.id) {
            subBranchScanned.forEach(s=>targetSet.add(s));
            subBranchScanned.clear();
            return;
        }

        if (limit>counter||limit===-1) {
            scanPerson.relationshipsInfo.relationships?.forEach(r=>{
                this.loadMiddlePersonsIdFromNested(targetSet, personToFind, r.person, limit, counter+1, new Set(subBranchScanned));
            })
        }
    }

    private scanPerson(person: NestedPersonResponseDto, targetScanSet: ScanRelationsSet, limit: number, counter: number = 0) {
        if (limit>counter||limit===-1) {
            targetScanSet.addRelation(null, person.id);
            this.recursiveScan(person,targetScanSet,limit,counter+1);
        }
    }

    private recursiveScan(person: NestedPersonResponseDto, targetScanSet: ScanRelationsSet, limit: number, counter: number): void {
        if (counter<limit||limit===-1) {
            person.relationshipsInfo.relationships?.forEach(relation=>{
                targetScanSet.addRelation(person.id, relation.person.id)
                this.recursiveScan(relation.person, targetScanSet, limit, counter+1);
            })
        }
    }
}