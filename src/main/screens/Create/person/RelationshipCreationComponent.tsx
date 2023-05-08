import {getFullName, Relationship, RelationType} from "../../../types/Person";
import {routingLinks} from "../../../data/appConfig";
import {Tables} from "../../../types/explorationParams";
import PrivateComponentWrapper from "../../components/PrivateComponentWrapper";
import {Permissions} from "../../../types/Role";
import {ForbiddenOutputCallbackModesEnum} from "../../components/PrivateComponent";
import {Form} from "react-bootstrap";
import React from "react";

type Props = {
    relationship: Relationship
}

const RelationshipCreationComponent = ({relationship}: Props) => {
    const person = relationship.person;

    const handleSelectChange = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        console.log(e.currentTarget.value)
    }

    return (
        <div className={"create-relationships-section__create-relation"}>
            <div className="create-relation__related-person">
                <div className="create-relation__person-avatar-wrapper">
                    {/*<img src="" alt="avatar" className="create-relation__relation-avatar"/>*/}
                </div>

                <ul className="create-relation__person-info">
                    <li className={"create-relation__person-info-li"}>ID: <span className={"fw-light"}>{person.id}</span></li>
                    <li className={"create-relation__person-info-li"}>ФІО: <span className={"fw-light"}>{getFullName(person)}</span></li>
                    <li className={"create-relation__person-info-li select-relation-type__heading"}>Ступінь родинних відносин:
                            <Form.Select className={"create-relation__select-relation-type"} value={undefined} onChange={handleSelectChange}>
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
        </div>
    )
}

export default RelationshipCreationComponent;