import {RelationType} from "../../model/human/person/Person";

export default function getReversedRelationType(relationType: RelationType): RelationType {
    switch (relationType) {
        case RelationType.FRIEND: return RelationType.FRIEND;

        case RelationType.SIBLING: return RelationType.SIBLING;

        case RelationType.PARENT: return RelationType.CHILD;
        case RelationType.CHILD: return RelationType.PARENT;

        case RelationType.SPOUSE: return RelationType.SPOUSE;

        case RelationType.RELATIVE: return RelationType.RELATIVE;

        default: throw new Error("unknown relation type: "+relationType)
    }
}