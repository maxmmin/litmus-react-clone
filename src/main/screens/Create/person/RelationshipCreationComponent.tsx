import {getFullName, Relationship} from "../../../types/Person";

type Props = {
    relationship: Relationship
}

const RelationshipCreationComponent = ({relationship}: Props) => {
    const person = relationship.person;
    return (
        <div className={"create-relationships-section__create-relation"}>
            <div className="create-relation__related-person">
                <div className="create-relation__person-avatar-wrapper">
                    {/*<img src="" alt="avatar" className="create-relation__relation-avatar"/>*/}
                </div>

                <ul className="create-relation__person-info">
                    <li className={"create-relation__person-info-li fw-light"}>ID: {person.id}</li>
                    <li className={"create-relation__person-info-li fw-light"}>ФІО: {getFullName(person)}</li>
                </ul>
            </div>
        </div>
    )
}

export default RelationshipCreationComponent;