import {useAppSelector} from "../../redux/hooks";
import {Tables} from "../../types/explorationParams";
import GetPersonDto from "../../types/GetPersonDto";
import {useMemo} from "react";
import PersonInfoTable from "./EntityTables/PersonInfoTable";
import {Results} from "../../redux/actions/ApiSearchActions";
import GetJurPersonDto from "../../types/GetJurPersonDto";
import JurPersonInfoTable from "./EntityTables/JurPersonInfoTable";
import GetUserDto from "../../types/GetUserDto";
import UserInfoTable from "./EntityTables/UserInfoTable";
import Loader from "../components/Loader";

const getParsedResults = (results: Results) => {
    const table = results.table;

    switch (table) {
        case Tables.PERSONS: {
            return results.map(entity=>{
                const person = entity as GetPersonDto;
                return <PersonInfoTable key={person.id} person={person}/>
            })
        }

        case Tables.JUR_PERSONS: {
            return results.map(entity=>{
                const jurPerson = entity as GetJurPersonDto;
                return <JurPersonInfoTable jurPerson={jurPerson} key={jurPerson.id}/>
            })
        }

        case Tables.USERS: {
            return results.map(entity=>{
                const user = entity as GetUserDto;
                return <UserInfoTable user={user} key={user.id}/>
            })
        }
    }
}


const ResultsContainer = () => {
    const results = useAppSelector(state => state.searchResults)

    if (!results) {
        return null;
    }
    console.log(results)
    return (
        <div className={"results-container"}>
            {results.length>0?
                <>
                    <h4>Результатів: {results.length}</h4>
                    {getParsedResults(results)}
                </>
                :
                results.pending?null:<h3 className=".text-center">Результатів не знайдено</h3>
            }
            {results.pending?<Loader/>:null}
        </div>
    )
}

export default ResultsContainer