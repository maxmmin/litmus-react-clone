import {useAppSelector} from "../../redux/hooks";
import {Entity} from "../../redux/exploration/EntityExplorationState";
import {MutableRefObject} from "react";
import PersonInfoTable from "./EntityTables/PersonInfoTable";
import {Results} from "../../../redux/exploration/data/ExplorationDataActions";
import JurPersonInfoTable from "./EntityTables/JurPersonInfoTable";
import UserInfoTable from "./EntityTables/UserInfoTable";
import Loader from "../loader/Loader";
import {getJurPersonFromEntity, getPersonFromResponse, getUserFromResponse} from "../../util/pureFunctions";

const getParsedResults = (results: Results) => {
    const table = results.table;

    const entities = results.data;

    switch (table) {
        case Entity.PERSON: {
            return entities.map(entity=>{
                const person = getPersonFromResponse(entity);
                return <PersonInfoTable key={person.id} person={person}/>
            })
        }

        case Entity.JUR_PERSON: {
            return entities.map(entity=>{
                const jurPerson = getJurPersonFromEntity(entity);
                return <JurPersonInfoTable jurPerson={jurPerson} key={jurPerson.id}/>
            })
        }

        case Entity.USER: {
            return entities.map(entity=>{
                const user = getUserFromResponse(entity);
                return <UserInfoTable user={user} key={user.id}/>
            })
        }
    }
}

type Props = {
    containerRef: MutableRefObject<HTMLDivElement|null>
}

const processResults = (results: Results) => {
    return <>
        {results.data.length>0?
            <>
                <h4>Результатів: {results.data.length}</h4>
                {getParsedResults(results)}
            </>
            :
            results.pending?null:<h3 className=".text-center">Результатів не знайдено</h3>
        }
        {results.pending?<Loader/>:null}
    </>
}

const ResultsContainer = ({containerRef}: Props) => {
    const results = useAppSelector(state => state.searchResults)

    return (
        <div className={"results-container"} ref={containerRef}>
            {
                results ? processResults(results) : null
            }
        </div>
    )
}

export default ResultsContainer