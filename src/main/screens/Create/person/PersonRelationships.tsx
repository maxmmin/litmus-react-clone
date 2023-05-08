import {Relationship, RelationshipsLinkObject} from "../../../types/Person";
import RelationshipCreationComponent from "./RelationshipCreationComponent";

type props = {relationsLinkObj: RelationshipsLinkObject}

const PersonRelationships = ({relationsLinkObj}: props) => {
    return (
            <>
                {
                    relationsLinkObj.relationships.map(relation => {
                        return (
                            <RelationshipCreationComponent relationship={relation}/>
                        )
                    })
                }
            </>
    )
}

export default PersonRelationships;