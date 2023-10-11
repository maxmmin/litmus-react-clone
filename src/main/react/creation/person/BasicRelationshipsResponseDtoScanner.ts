import {NestedPersonResponseDto, RelationshipsInfoResponseDto} from "../../../rest/dto/person/PersonResponseDto";

export default class BasicRelationshipsResponseDtoScanner {
    scan(dto: RelationshipsInfoResponseDto, limit: number): {shared: Set<number>, all: Set<number>} {
        const sharedSet: Set<number> = new Set();

        // id->depth
        const relatedMap: Map<number, number> = new Map();

        const rootRelationships = dto.relationships;

        if (rootRelationships) {
            rootRelationships.forEach(rootRel=>{
                sharedSet.add(rootRel.person.id);
                relatedMap.set(rootRel.person.id, 1)
            })

            const stack: {dto: NestedPersonResponseDto, depth: number}[] = []


            rootRelationships.forEach(rootRelationship=>{
                if (rootRelationship.person.relationshipsInfo.relationships) {
                    stack.push(...rootRelationship.person.relationshipsInfo.relationships.map(r=>({dto: r.person, depth: 2})))
                }

                while (stack.length > 0) {
                    const stackObject = stack.shift()!;

                    const depth = stackObject.depth;

                    if (depth!==-1&&depth>=limit) {
                        continue;
                    }

                    const nestedPersonDto = stackObject.dto;

                    if (nestedPersonDto.relationshipsInfo.relationships) {
                        const currentDepth = depth+1;

                        nestedPersonDto.relationshipsInfo.relationships.forEach(r => {
                            const related = r.person;
                            if (!relatedMap.has(related.id)) {
                                relatedMap.set(related.id, currentDepth);
                                stack.push({dto: related, depth: depth});
                            } else {
                                const previousDepth = relatedMap.get(related.id)!;
                                if (Math.abs(previousDepth-currentDepth)!==1) sharedSet.add(related.id);
                            }
                        })
                    }

                }
            })
        }

        return {all: new Set<number>(relatedMap.keys()), shared: sharedSet};
    }

}