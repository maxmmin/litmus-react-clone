import {
    NestedPersonResponseDto,
    NestedRelationshipsInfoResponseDto
} from "../../../rest/dto/person/PersonResponseDto";
import {RawRelationshipsPerson} from "../../../model/human/person/Person";

export default class BasicRelationshipsResponseDtoScanner {
    scan(person: RawRelationshipsPerson, limit: number): {shared: Set<number>, all: Set<number>} {
        const dto = person.relationshipsInfo;

        const sharedSet: Set<number> = new Set();

        const duplicatedSet: Set<number> = new Set();

        const relatedSet: Set<number> = new Set();

        const rootRelationships = dto.relationships;

        if (rootRelationships) {
            const rootRelationshipsIdList = rootRelationships.map(r=>r.person.id).concat(person.id);
            rootRelationshipsIdList.forEach(id=>{
                sharedSet.add(id);
                relatedSet.add(id)
            })

            const stack: {dto: NestedPersonResponseDto, depth: number}[] = []


            rootRelationships.forEach((rootRelationship)=>{
                const branchSet: Set<number> = new Set([person.id, rootRelationship.person.id]);

                if (rootRelationship.person.relationshipsInfo.relationships) {
                    rootRelationship.person.relationshipsInfo.relationships.forEach(r=>{
                        if (!branchSet.has(r.person.id)) {
                            stack.push({dto: r.person, depth: 2});
                        }
                    })
                }

                while (stack.length > 0) {
                    const stackObject = stack.pop()!;

                    const depth = stackObject.depth;

                    if (limit!==-1&&depth>=limit) {
                        continue;
                    }

                    const nestedPersonDto = stackObject.dto;

                    if (relatedSet.has(nestedPersonDto.id)&&!branchSet.has(nestedPersonDto.id)) {
                        duplicatedSet.add(nestedPersonDto.id);
                        continue;
                    }

                    branchSet.add(nestedPersonDto.id);

                    if (nestedPersonDto.relationshipsInfo.relationships) {
                        const currentDepth = depth+1;

                        nestedPersonDto.relationshipsInfo.relationships.forEach(r => {
                            const related = r.person;

                            if (!branchSet.has(related.id)) {
                                stack.push({dto: related, depth: currentDepth});
                            }
                        })
                    }
                }

                [...branchSet].forEach(id=>relatedSet.add(id));
            })
        }

        const sh: Set<number> = new Set();

        this.scanForSharedRelationships(sh,person.relationshipsInfo, [...duplicatedSet], -1);

        [...sh].forEach(id=>sharedSet.add(id));

        return {all: new Set<number>(relatedSet.keys()), shared: sharedSet};
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