import {Relationship} from "../../../model/human/person/Person";
import RelationshipCreationComponent from "./RelationshipCreationComponent";
import {ValidationErrors} from "../../../service/ValidationErrors";
import {
    PersonValidationObject, RelationShipValidationObject
} from "../../../service/creation/validation/human/person/PersonCreationValidationService";

type props = {relationships: Relationship[], validationErrors: RelationShipValidationObject[]}

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