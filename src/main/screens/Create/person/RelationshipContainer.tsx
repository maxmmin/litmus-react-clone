import {Relationship} from "../../../types/Person";

type Props = {
    relationship: Relationship
}

const RelationshipContainer = () => {
    return (
        <div className={"create-relationships-section__create-relation"}>
            <div className="create-relation__related-person">
                <div className="create-relation__person-avatar-wrapper">
                    <img src="" alt="avatar" className="create-relation__relation-avatar"/>
                </div>

                <div className="create-relation__person-info">
                    <p>ID</p>
                </div>
            </div>
        </div>
    )
}

export default RelationshipContainer;