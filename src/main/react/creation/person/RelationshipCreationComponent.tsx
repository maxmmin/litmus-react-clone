import {RelationType} from "../../../model/human/person/Person";
import {FloatingLabel, Form} from "react-bootstrap";
import React, {useEffect} from "react";
import {CrossIcon, DashedUserIcon} from "../../assets/icons";
import PersonCreationStateManager from "../../../service/stateManagers/creation/person/PersonCreationStateManager";
import PersonCreationStateManagerImpl
    from "../../../service/stateManagers/creation/person/PersonCreationStateManagerImpl";
import PersonCreationValidationService, {
    getRelationshipDefaultValidationObject,
    RelationShipValidationObject
} from "../../../service/validation/human/person/PersonCreationValidationService";
import InputError from "../../sharedComponents/InputError";
import {useSelector} from "react-redux";
import {buildUrl} from "../../../util/pureFunctions";
import appConfig from "../../../config/appConfig";
import {RelationshipCreationParams} from "../../../service/coreServices/creation/PersonCreationService";
import getFullName from "../../../util/functional/getFullName";
import {getRelationTypeFrom} from "../../../util/person/RelationshipsLinkObject";
import SecuredImage from "../../sharedComponents/SecuredImage";


type Props = {
    relationship: RelationshipCreationParams,
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
            // relationship creation object can not exist if there was no creation checks before
           return getRelationshipDefaultValidationObject(relationship);
        }
    })

    const handleSelectChange = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        const relShip: RelationshipCreationParams = {...relationship};
        try {
            relShip.type = getRelationTypeFrom(e.currentTarget.value)
        } catch (e) {
            relShip.type = null;
        }
       personCreationStateManager.updateRelationship(relShip)

        const updatedValidationObject = validationService.validateRelationship(relShip);

        if (validationObject.type) {
            if (!updatedValidationObject.type) {
                stateManager.updateRelationshipValidationErrors({relationship: relShip, type: null});
            } else if (updatedValidationObject.type !== validationObject.type) stateManager.updateRelationshipValidationErrors({relationship: updatedValidationObject.relationship, type: updatedValidationObject.type});
        }
    }

    const relType = relationship.type?relationship.type:undefined;

    const image: string|null = relationship.to.media.mainImage||relationship.to.media.images[0];

    return (
        <div className={"create-relationships-section__create-relation"}>
            <div className="create-relation__related-person">
                <div className="create-relation__person-avatar-wrapper">
                    {
                        image?
                            <SecuredImage src={buildUrl(appConfig.serverMappings.mediaRootUrl, image)} alt="avatar" className="create-relation__person-avatar"/>
                            :
                            <DashedUserIcon className={"create-relation__person-avatar"}/>
                    }

                </div>

                <ul className="create-relation__person-info">
                    <li className={"create-relation__person-info-li"}>ID: <span className={"fw-light"}>{personTo.id}</span></li>
                    <li className={"create-relation__person-info-li"}>ФІО: <span className={"fw-light"}>{getFullName(personTo)}</span></li>
                    <li className={"create-relation__person-info-li select-relation-type__heading"}>Ступінь родинних відносин:
                            <Form.Select className={`create-relation__select-relation-type ${validationObject.type?"is-invalid":""}`} value={relType} onChange={handleSelectChange}>
                                <option value={undefined}>Не обрано</option>
                                <option value={RelationType.PARENT}>Батько/мати/опікун</option>
                                <option value={RelationType.SPOUSE}>Чоловік/дружина</option>
                                <option value={RelationType.SIBLING}>Брат/сестра</option>
                                <option value={RelationType.RELATIVE}>Родич</option>
                                <option value={RelationType.FRIEND}>Друг</option>
                            </Form.Select>
                        <InputError error={validationObject.type}/>
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

                            const updatedValidationObject = validationService.validateRelationship(relShip);

                            if (validationObject.note) {
                                if (!updatedValidationObject.note) {
                                    stateManager.updateRelationshipValidationErrors({relationship: relShip, note: null});
                                } else if (updatedValidationObject.note !== validationObject.note) stateManager.updateRelationshipValidationErrors(updatedValidationObject)
                            }
                        }}
                    />
                </FloatingLabel>
                <InputError error={validationObject.note}/>
            </div>

            <div className="create-relation__remove-btn-wrapper">
                <button className="create-relation__remove-btn" onClick={()=>{
                    personCreationStateManager.removeRelationship(relationship);

                }}>
                    <CrossIcon className={"create-relation__remove-btn-icon rotate45"} color={"grey"}/>
                </button>
            </div>
        </div>
    )
}

export default RelationshipCreationComponent;