import {getFullName, getRelationTypeFrom, Relationship, RelationType} from "../../../model/human/person/Person";
import {FloatingLabel, Form} from "react-bootstrap";
import React, {useEffect} from "react";
import {CrossIcon, DashedUserIcon} from "../../../util/icons";
import PersonCreationStateManager from "../../../service/creation/stateManager/person/PersonCreationStateManager";
import PersonCreationStateManagerImpl
    from "../../../service/creation/stateManager/person/PersonCreationStateManagerImpl";
import PersonCreationValidationService, {
    getRelationshipDefaultValidationObject,
    RelationShipValidationObject
} from "../../../service/creation/validation/human/person/PersonCreationValidationService";
import InputError from "../../sharedComponents/InputError";
import {useSelector} from "react-redux";
import {buildUrl} from "../../../util/pureFunctions";
import appConfig from "../../../config/appConfig";


type Props = {
    relationship: Relationship,
    validationService: PersonCreationValidationService,
    stateManager: PersonCreationStateManager
}

const RelationshipCreationComponent = ({relationship, validationService, stateManager}: Props) => {
    const personCreationStateManager: PersonCreationStateManager = new PersonCreationStateManagerImpl();

    const personTo = relationship.to;

    const validationObject: RelationShipValidationObject = useSelector(()=>{
        try {
            return stateManager.getRelationshipValidationErrors(relationship);
        } catch (e) {
            // relationship validation object can not exist if there was no validation checks before
           return getRelationshipDefaultValidationObject(relationship);
        }
    })

    const handleSelectChange = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        const relShip: Relationship = {...relationship};
        try {
            relShip.type = getRelationTypeFrom(e.currentTarget.value)
        } catch (e) {
            relShip.type = null;
        }
       personCreationStateManager.updateRelationship(relShip)
    }

    useEffect(()=>{
        const updatedValidationObject = validationService.validateRelationship(relationship);
        if (validationObject.relationType&&!updatedValidationObject.relationType) {
            stateManager.updateRelationshipValidationErrors({relationship: relationship, relationType: null});
        }

        if (validationObject.note&&!updatedValidationObject.note) {
            stateManager.updateRelationshipValidationErrors({relationship: relationship, note: null})
        }
    }, [relationship])

    const relType = relationship.type?relationship.type:undefined;

    const image: string|undefined = relationship.to.media.mainImage||relationship.to.media.images[0];

    return (
        <div className={"create-relationships-section__create-relation"}>
            <div className="create-relation__related-person">
                <div className="create-relation__person-avatar-wrapper">
                    {
                        image?
                            <img src={buildUrl(appConfig.serverMappings.mediaRootUrl, image)} alt="avatar" className="create-relation__person-avatar"/>
                            :
                            <DashedUserIcon className={"create-relation__person-avatar"}/>
                    }

                </div>

                <ul className="create-relation__person-info">
                    <li className={"create-relation__person-info-li"}>ID: <span className={"fw-light"}>{personTo.id}</span></li>
                    <li className={"create-relation__person-info-li"}>ФІО: <span className={"fw-light"}>{getFullName(personTo)}</span></li>
                    <li className={"create-relation__person-info-li select-relation-type__heading"}>Ступінь родинних відносин:
                            <Form.Select className={"create-relation__select-relation-type"} value={relType} onChange={handleSelectChange}>
                                <option value={undefined}>Не обрано</option>
                                <option value={RelationType.PARENT}>Батько/мати/опікун</option>
                                <option value={RelationType.SPOUSE}>Чоловік/дружина</option>
                                <option value={RelationType.SIBLING}>Брат/сестра</option>
                                <option value={RelationType.RELATIVE}>Родич</option>
                                <option value={RelationType.FRIEND}>Друг</option>
                            </Form.Select>
                    </li>
                </ul>
            </div>

            <div className="create-relation__note">
                <FloatingLabel className={"create-relation__floating-label-container"} controlId="create-relation__note-text-area-id" label="Нотатка">
                    <Form.Control
                        className={`create-relation__note-textarea fw-light ${validationObject.note?"is-invalid":""}`}
                        as="textarea"
                        placeholder="Залишіть нотатку"
                        style={{ height: '100px' }}
                        value={relationship.note}
                        onChange={e => {
                            const relShip = {...relationship};
                            relShip.note = e.currentTarget.value;
                            personCreationStateManager.updateRelationship(relShip);
                        }}
                    />
                </FloatingLabel>
                <InputError error={validationObject.note}/>
            </div>

            <div className="create-relation__remove-btn-wrapper">
                <button className="create-relation__remove-btn" onClick={()=>{
                    personCreationStateManager.removeRelationship(relationship);

                }}>
                    <CrossIcon className={"create-relation__remove-btn-icon"} color={"grey"}/>
                </button>
            </div>
        </div>
    )
}

export default RelationshipCreationComponent;