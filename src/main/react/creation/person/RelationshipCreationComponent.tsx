import {getFullName, getRelationTypeFrom, Relationship, RelationType} from "../../../model/human/person/Person";
import {FloatingLabel, Form} from "react-bootstrap";
import React from "react";
import {CrossIcon} from "../../../util/icons";
import {useAppDispatch} from "../../../redux/hooks";
import PersonCreationStateManager from "../../../service/creation/stateManager/person/PersonCreationStateManager";
import store from "../../../redux/store";
import container from "../../../inversify/inversify.config";
import IOC_TYPES from "../../../inversify/IOC_TYPES";

type Props = {
    relationship: Relationship
}

const RelationshipCreationComponent = ({relationship}: Props) => {
    const personCreationStateManager: PersonCreationStateManager = container.get<PersonCreationStateManager>(IOC_TYPES.creation.stateManagers.PersonCreationStateManager);

    const personTo = relationship.person;

    const dispatch = useAppDispatch();

    const handleSelectChange = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        const relShip: Relationship = {...relationship};
        try {
            relShip.relationType = getRelationTypeFrom(e.currentTarget.value)
        } catch (e) {
            relShip.relationType = null;
        }
       personCreationStateManager.updateRelationship(relShip)
    }

    const relType = relationship.relationType?relationship.relationType:undefined;

    return (
        <div className={"create-relationships-section__create-relation"}>
            <div className="create-relation__related-person">
                <div className="create-relation__person-avatar-wrapper">
                    {/*<img src="" alt="avatar" className="create-relation__relation-avatar"/>*/}
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
                        className={"create-relation__note-textarea fw-light"}
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