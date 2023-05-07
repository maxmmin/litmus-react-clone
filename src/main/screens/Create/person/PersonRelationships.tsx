import {Relationship} from "../../../types/Person";
import RelationshipCreationComponent from "./RelationshipCreationComponent";

type props = {relations: Array<Relationship>}

const PersonRelationships = ({relations}: props) => {
    return (
            <>
                {
                    relations.map(relation => {
                        return (
                            <RelationshipCreationComponent relationship={relation}/>
                        )
                    })
                }
            </>
    )
}

export default PersonRelationships;