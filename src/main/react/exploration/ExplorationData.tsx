import {Entity} from "../../model/Entity";
import Pagination from 'react-bootstrap/Pagination';
import PersonInfoTable from "./EntityTables/PersonInfoTable";
import JurPersonInfoTable from "./EntityTables/JurPersonInfoTable";
import UserInfoTable from "./EntityTables/UserInfoTable";
import {getJurPersonFromEntity, getPersonFromResponse, getUserFromResponse} from "../../util/pureFunctions";
import ExplorationStateManagerImpl from "../../service/exploration/stateManager/ExplorationStateManagerImpl";
import store from "../../redux/store";
import PagedData, {isUnPaged} from "../../util/apiRequest/PagedData";
import EntityExplorationState from "../../redux/exploration/types/EntityExplorationState";
import {isPending} from "@reduxjs/toolkit";
import Loader from "../loader/Loader";

const getProcessedResults = (entity: Entity, results: any[]) => {
    switch (entity) {
        case Entity.PERSON: {
            return results.map(entity=>{
                const person = getPersonFromResponse(entity);

                return <PersonInfoTable key={person.id} person={person}/>
            })
        }

        case Entity.JUR_PERSON: {
            return results.map(entity=>{
                const jurPerson = getJurPersonFromEntity(entity);
                return <JurPersonInfoTable jurPerson={jurPerson} key={jurPerson.id}/>
            })
        }

        case Entity.USER: {
            return results.map(entity=>{
                const user = getUserFromResponse(entity);
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

    const manager = ExplorationStateManagerImpl.getEntityManager(exploredEntity);

    const entity = manager.entity;

    if (state.isPending) {
        return <div style={{margin: '50px auto 0px', maxWidth: '100px'}}>
            <Loader/>
        </div>
    }

    const data = state.data;

    if (!data) return null;

    const pagedResponse: PagedData<any> = data.response;

    const {content, totalElements} = pagedResponse;

    const unPaged: boolean = isUnPaged(pagedResponse)

    return (
        <div className={"results-container"}>
            {unPaged?null:<Pagination results={pagedResponse.numberOfElements}/>}
            <h4>Результатів: {totalElements}</h4>
            {getProcessedResults(entity, content)}
        </div>
    )
}

export default ExplorationData