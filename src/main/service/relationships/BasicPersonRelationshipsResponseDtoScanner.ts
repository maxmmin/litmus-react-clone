import {
    NestedPersonResponseDto,
    NestedRelationshipsInfoResponseDto
} from "../../rest/dto/person/PersonResponseDto";
import {RawRelationshipsPerson} from "../../model/human/person/Person";
import PersonRelationshipsResponseDtoScanner, {ScanResult} from "./PersonRelationshipsResponseDtoScanner";

export default class BasicPersonRelationshipsResponseDtoScanner implements PersonRelationshipsResponseDtoScanner{
    public static getInstance(): BasicPersonRelationshipsResponseDtoScanner {
        return new BasicPersonRelationshipsResponseDtoScanner();
    }

    scan(person: RawRelationshipsPerson, limit: number): ScanResult {
        const tree = person.relationshipsInfo.relationships;

        const scannedPersons: Set<number> = new Set();

        const duplicatedPersons: Set<number> = new Set();

        const generalRelations: Set<string> = new Set();

        const sharedPersons: Set<number> = new Set();

        if (tree) {
            if (limit===-1||limit>0) tree.forEach(r=>sharedPersons.add(r.person.id));

            for (const rootRelationship of tree) {
                const branchRelations: Set<string> = new Set();
                const personDto = rootRelationship.person;
                this.recursiveScanBranchRelations({scannedPersons: scannedPersons, relations: branchRelations}, personDto, limit);
                branchRelations.forEach(stringRel=>{
                    const [fromIdStr,toIdStr] = stringRel.split("/")!;

                    generalRelations.forEach(rStr=>{
                        if (!rStr.startsWith(fromIdStr)&&rStr.endsWith(toIdStr)) {
                            duplicatedPersons.add(+toIdStr);
                        }
                    })
                })
                branchRelations.forEach(r=>generalRelations.add(r));
            }
        }

        this.scanForSharedRelationships(sharedPersons,person.relationshipsInfo, [...duplicatedPersons], limit)

        return {all: scannedPersons, shared: sharedPersons};
    }

    private recursiveScanBranchRelations(target: {scannedPersons: Set<number>,relations: Set<string>}, person: NestedPersonResponseDto, limitDepth: number, depth: number=0): void {
        if (limitDepth!==-1&&depth>=limitDepth) return;
        target.scannedPersons.add(person.id);
        if (person.relationshipsInfo.relationships) {
            for (const relationship of person.relationshipsInfo.relationships) {
                target.relations.add(`${person.id}/${relationship.person.id}`)
                this.recursiveScanBranchRelations(target, relationship.person, limitDepth, depth+1)
            }
        }
    }

    private scanForSharedRelationships(targetSet: Set<number>, relationshipsInfo: NestedRelationshipsInfoResponseDto, duplicateIdList: number[], limit: number, counter: number = 0, scannedPersons: Set<number> = new Set()) {
        if (limit!==-1&&counter>=limit) return;

        if (relationshipsInfo.relationships) {
            relationshipsInfo.relationships.forEach(r=>{
                const branchSet = new Set(scannedPersons);
                branchSet.add(r.person.id);
                if (duplicateIdList.includes(r.person.id)) {
                    branchSet.forEach(id=>targetSet.add(id))
                }
                this.scanForSharedRelationships(targetSet,r.person.relationshipsInfo,duplicateIdList,limit,counter+1, branchSet)
            })
        }
    }

}