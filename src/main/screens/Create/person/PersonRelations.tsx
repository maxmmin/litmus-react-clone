import {InitPersonCreationParams} from "../../../redux/actions/CreationParamsActions";
import PersonInfoTable from "../../Explore/EntityTables/PersonInfoTable";
import {Relationship} from "../../../types/Person";

type props = {relations: Array<Relationship>}

const PersonRelations = ({relations}: props) => {
    return (
            <>
                {
                    relations.map(relation => {
                        return (
                            <div>
                                <PersonInfoTable person={relation.person}/>
                            </div>
                        )
                    })
                }
            </>
    )
}

export default PersonRelations;