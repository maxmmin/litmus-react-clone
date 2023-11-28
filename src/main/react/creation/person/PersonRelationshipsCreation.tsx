import {Relationship} from "../../../model/human/person/Person";
import RelationshipCreationComponent from "./RelationshipCreationComponent";
import {useContext} from "react";
import {LitmusServiceContext} from "../../App";
import {RelationshipCreationParams} from "../../../service/coreServices/creation/PersonCreationService";

type props = {relationships: RelationshipCreationParams[]}

const PersonRelationshipsCreation = ({relationships}: props) => {
    const validationService = useContext(LitmusServiceContext).creation.validation.person;
    const stateManager = useContext(LitmusServiceContext).creation.stateManagers.person;
    return (
            <>
                {
                    relationships.map(relation => {
                        return (
                            <RelationshipCreationComponent
                                validationService={validationService}
                                key={relation.to.id}
                                relationship={relation}
                                stateManager={stateManager}
                            />
                        )
                    })
                }
            </>
    )
}

export default PersonRelationshipsCreation;