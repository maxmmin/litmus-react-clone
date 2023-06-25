import {Entity} from "../../model/Entity";
import Pagination from 'react-bootstrap/Pagination';
import PersonInfoTable from "./EntityTables/PersonInfoTable";
import JurPersonInfoTable from "./EntityTables/JurPersonInfoTable";
import UserInfoTable from "./EntityTables/UserInfoTable";
import ExplorationStateManagerImpl from "../../service/exploration/stateManager/ExplorationStateManagerImpl";
import PagedData, {isUnPaged} from "../../rest/PagedData";
import EntityExplorationState from "../../redux/types/exploration/EntityExplorationState";
import Loader from "../loader/Loader";
import Person from "../../model/human/person/Person";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import User from "../../model/human/user/User";

const getProcessedResults = (entity: Entity, data: unknown[]) => {
    switch (entity) {
        case Entity.PERSON: {
            return (data as Person[]).map(person=>{
                return <PersonInfoTable key={person.id} person={person}/>
            })
        }

        case Entity.JUR_PERSON: {
            return (data as JurPerson[]).map(jurPerson=>{
                return <JurPersonInfoTable jurPerson={jurPerson} key={jurPerson.id}/>
            })
        }

        case Entity.USER: {
            return (data as User[]).map(user=>{
                return <UserInfoTable user={user} key={user.id}/>
            })
        }

        default: throw new Error("unknown entity")
    }
}

type Props = {
    exploredEntity: Entity,
    state: EntityExplorationState<any, any>
}

const ExplorationData = ({exploredEntity, state}: Props) => {
    if (state.isPending) {
        return <div style={{margin: '50px auto 0px', maxWidth: '100px'}}>
            <Loader/>
        </div>
    }

    const data = state.data;

    if (!data) return null;

    const pagedResponse: PagedData<unknown> = data.response;

    const {content, totalElements} = pagedResponse;

    const unPaged: boolean = isUnPaged(pagedResponse)

    return (
        <div className={"results-container"}>
            {unPaged?null:<Pagination results={pagedResponse.numberOfElements}/>}
            <h4>Результатів: {totalElements}</h4>
            {getProcessedResults(exploredEntity, content)}
        </div>
    )
}

export default ExplorationData