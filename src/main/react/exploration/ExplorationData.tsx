import {Entity} from "../../model/Entity";
import Pagination from 'react-bootstrap/Pagination';
import PersonInfoTable from "./EntityTables/PersonInfoTable";
import JurPersonInfoTable from "./EntityTables/JurPersonInfoTable";
import UserInfoTable from "./EntityTables/UserInfoTable";
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

type PaginationProps = {
    pagedData: PagedData<unknown>
}

const getVisibleIndexes = (pagedData: PagedData<unknown>) => {
    const desirableLength = 5;

    const sideLength = Math.trunc(desirableLength/2);

    const indexes: number[] = [pagedData.index]

    for (let cursor = pagedData.index-1; cursor>0&&cursor>pagedData.index-1-sideLength; cursor--) {
        indexes.unshift(cursor);
    }

    for (let cursor = pagedData.index+1; cursor<pagedData.totalPages-1&&cursor<pagedData.index+1+sideLength; cursor++) {
        indexes.push(cursor);
    }

    return indexes;
}

const ExplorationPagination = ({pagedData}: PaginationProps) => {

    const indexes = getVisibleIndexes(pagedData);

    return (
        <Pagination className={"exploration-pagination"}>
            <Pagination.First />
            <Pagination.Prev />
            {indexes.map(index => <Pagination.Item key={index} active={pagedData.index===index}>{index+1}</Pagination.Item>)}
            <Pagination.Next />
            <Pagination.Last />
        </Pagination>
    )
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
            <div className="results-container__header">
                <h4>Результатів: {totalElements}</h4>
                {unPaged?null:<ExplorationPagination pagedData={{...pagedResponse, index: 25, totalElements: 10000, totalPages: 40}}/>}
            </div>
            {getProcessedResults(exploredEntity, content)}
        </div>
    )
}

export default ExplorationData