import {Relationship, RelationshipsLinkObject} from "../../../model/person/Person";
import RelationshipCreationComponent from "./RelationshipCreationComponent";

type props = {relationships: Relationship[]}

const PersonRelationships = ({relationships}: props) => {
    return (
            <>
                {
                    relationships.map(relation => {
                        return (
                            <RelationshipCreationComponent key={relation.person.id} relationship={relation}/>
                        )
                    })
                }
            </>
    )
}

export default PersonRelationships;