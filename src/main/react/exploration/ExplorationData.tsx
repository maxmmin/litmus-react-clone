import {Entity} from "../../model/Entity";
import Pagination from 'react-bootstrap/Pagination';
import PersonInfoTable from "./EntityTables/PersonInfoTable";
import JurPersonInfoTable from "./EntityTables/JurPersonInfoTable";
import UserInfoTable from "./EntityTables/UserInfoTable";
import PagedData, {isUnPaged} from "../../rest/PagedData";
import EntityExplorationState from "../../redux/types/exploration/EntityExplorationState";
import Loader from "../loader/Loader";
import Person, {PreProcessedPerson} from "../../model/human/person/Person";
import {JurPerson, PreProcessedJurPerson} from "../../model/jurPerson/JurPerson";
import User from "../../model/human/user/User";
import ExplorationStateManager from "../../service/stateManagers/exploration/ExplorationStateManager";
import EntityExplorationParams from "../../redux/types/exploration/EntityExplorationParams";
import getEntityExplorationService, {getEntityExplorationStateManager} from "../../util/getEntityExplorationService";
import {useAppSelector} from "../../redux/hooks";
import ExplorationService from "../../service/coreServices/exploration/ExplorationService";
import {getVisibleIndexes} from "../../util/pageDataUtils";
import serviceContext from "../../serviceContext";

const getProcessedResults = (entity: Entity, data: unknown[]) => {
    const {jurPerson: jurPersonDtoMapper, person: personDtoMapper} = serviceContext.mappers;
    switch (entity) {
        case Entity.PERSON: {
            return (data as PreProcessedPerson[]).map(rawPerson=>{
                const person: Person = personDtoMapper.mapPreProcessedPersonWithLoss(rawPerson);
                return <PersonInfoTable key={person.id} person={person}/>
            })
        }

        case Entity.JUR_PERSON: {
            return (data as PreProcessedJurPerson[]).map(rawJurPerson=>{
                const jurPerson: JurPerson = jurPersonDtoMapper.mapPreprocessedJurPersonWithLoss(rawJurPerson)
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
    pagedData: PagedData<unknown>,
    explorationStateManager: ExplorationStateManager<unknown, EntityExplorationParams>,
    explorationService: ExplorationService
}


const ExplorationPagination = ({pagedData, explorationStateManager, explorationService}: PaginationProps) => {

    const indexes = getVisibleIndexes(pagedData);

    const currentParams = useAppSelector(()=>explorationStateManager.getExplorationParams());

    function refreshWithI (i: number) {
        explorationStateManager.setParams({...currentParams, i: i});
        explorationService.explore();
    }

    return (
        <Pagination className={"litmus-pagination"}>
            <Pagination.First disabled={pagedData.first} onClick={()=>{
                refreshWithI(0);
            }} />
            <Pagination.Prev disabled={pagedData.first} onClick={()=>{
                refreshWithI(currentParams.i-1)
            }} />
            {indexes.map(index => <Pagination.Item onClick={()=>{
                if (pagedData.index!==index) {
                    refreshWithI(index);
                }
            }} key={index} active={pagedData.index===index}>{index+1}</Pagination.Item>)}
            <Pagination.Next disabled={pagedData.last} onClick={() =>{
                refreshWithI(currentParams.i+1)
            }} />
            <Pagination.Last disabled={pagedData.last} onClick={()=>{
                refreshWithI(pagedData.totalPages-1)
            }} />
        </Pagination>
    )
}

const ExplorationData = ({exploredEntity, state}: Props) => {

    const explorationService = getEntityExplorationService(exploredEntity);
    const explorationStateManager = getEntityExplorationStateManager(exploredEntity);

    const data = state.data;

    const pagedResponse: PagedData<unknown>|undefined = data?.response;


    const unPaged: boolean = pagedResponse?isUnPaged(pagedResponse):true;

    if (state.isPending) {
        return <div style={{margin: '50px auto 0px', maxWidth: '100px'}}>
            <Loader/>
        </div>
    }

    if (!data||!pagedResponse) return null;

    const {content, totalElements} = pagedResponse;

    return (
        <div className={"results-container"}>
            <div className="results-container__header">
                <h4>Результатів: {totalElements}</h4>
                {unPaged?null:<ExplorationPagination explorationService={explorationService} explorationStateManager={explorationStateManager} pagedData={pagedResponse}/>}
            </div>
            {getProcessedResults(exploredEntity, content)}
        </div>
    )
}

export default ExplorationData