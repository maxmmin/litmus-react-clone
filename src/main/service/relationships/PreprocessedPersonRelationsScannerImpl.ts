import PreprocessedPersonRelationsScanner from "./PreprocessedPersonRelationsScanner";
import {PreProcessedPerson} from "../../model/human/person/Person";
import PersonResponseDto, {
    NestedPersonResponseDto,
    NestedRelationshipsInfo,
    RelatedPersonResponseDto
} from "../../rest/dto/person/PersonResponseDto";
import {EmbedJurPersonResponseDto} from "../../rest/dto/jurPerson/JurPersonResponseDto";
import checkJurPersonDto from "../../util/checkJurPersonDto";
import {retry} from "@reduxjs/toolkit/query";

type BranchScan = Map<NestedPersonResponseDto, Set<number>>

type Relation = {
    from: number,
    to: number
}

class ScanRelationsSet {
    // from, toArray
    private readonly scanMap: Map<number, Set<number>> = new Map;

    addRelation(from: number, to: number) {
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
            idSet.add(r.from);
        })
        return idSet;
    }
    public getDuplicatedPersonsIds (branchSets: ScanRelationsSet[]): Set<number> {
        const relations = this.getSharedRelations(branchSets);

        const ids: Set<number> = new Set;
        relations.forEach(({from, to})=>{
            ids.add(from);
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
                            console.log(...relations)
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
                this.recursiveScan(p, targetScanSet, limit);
                scanSets.push(targetScanSet);
            });
        }

        const sharedRelations: Set<number> = this.scanRelationsSetUtil.getDuplicatedPersonsIds(scanSets);

        sharedRelations.forEach(r=>{
            shared.add(r);
        });

        [...shared].map(id=>this.loadMiddlePersonsId(shared,id,person, limit, 0));

        const scannedRelations: Set<number> = scanSets.reduce((acc, set)=>{
            const idSet = this.scanRelationsSetUtil.extractPersonIds(set);
            return new Set([...idSet, ...acc]);
        }, new Set<number>)

        scannedRelations.forEach(r=>{
            scannedPersons.add(r);
        })

        // if (limit>0||limit===-1) {
        //     rootPersons.forEach(p=>shared.add(p.id))
        //     const jpContainable = [...rootPersons, person];
        //     jpContainable
        //         .forEach(p=>{
        //             [...p.benOwnedJurPersons, ...p.ownedJurPersons].forEach(jurPerson=>{
        //                 if (checkJurPersonDto(jurPerson)) {
        //                     const owner = jurPerson.owner;
        //                     if (owner&&![...branchesScanned.keys()].some(p=>p.id===owner.id)) {
        //                         const branchData = this.recursiveScan(p, limit);
        //                         branchesScanned.set(p, branchData);
        //                     }
        //
        //                     const benOwner = jurPerson.benOwner;
        //                     if (benOwner&&![...branchesScanned.keys()].some(p=>p.id===benOwner.id)) {
        //                         const branchData = this.recursiveScan(p, limit);
        //                         branchesScanned.set(p, branchData);
        //                     }
        //                 }
        //             })
        //         });
        // }
        console.log(scannedPersons)
        console.log(shared)

        return {all: scannedPersons, shared: shared};
    }

    private loadMiddlePersonsId(targetSet: Set<number>, personToFind: number, scanPerson: NestedPersonResponseDto,
                                limit: number, counter: number, subBranchScanned: Set<number> = new Set) {
        subBranchScanned.add(scanPerson.id);

        if (personToFind===scanPerson.id) {
            subBranchScanned.forEach(s=>targetSet.add(s));
            subBranchScanned.clear();
            return;
        }

        if (limit>counter||limit===-1) {
            scanPerson.relationshipsInfo.relationships?.forEach(r=>{
                this.loadMiddlePersonsId(targetSet, personToFind, r.person, limit, counter+1, new Set(subBranchScanned));
            })
        }
    }


    private recursiveScan(person: NestedPersonResponseDto, targetScanSet: ScanRelationsSet, limit: number, counter=1): void {
        person.relationshipsInfo.relationships?.forEach(relation=>{
            targetScanSet.addRelation(person.id, relation.person.id)
            this.recursiveScan(relation.person, targetScanSet, limit, counter+1);
        })
    }
}