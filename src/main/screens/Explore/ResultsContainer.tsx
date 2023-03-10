import {useAppSelector} from "../../redux/hooks";
import {Tables} from "../../types/explorationParams";
import Person from "../../types/Person";
import {useMemo} from "react";
import PersonInfoTable from "./EntityTables/PersonInfoTable";
import {Results} from "../../redux/actions/ApiSearchActions";
import JurPerson from "../../types/JurPerson";
import JurPersonInfoTable from "./EntityTables/JurPersonInfoTable";
import User from "../../types/User";
import UserInfoTable from "./EntityTables/UserInfoTable";

const getParsedResults = (results: Results) => {
    const table = results.table;

    console.log(table)

    switch (table) {
        case Tables.PERSONS: {
            return results.map(entity=>{
                const person = entity as Person;
                return <PersonInfoTable key={person.id} person={person}/>
            })
        }

        case Tables.JUR_PERSONS: {
            return results.map(entity=>{
                const jurPerson = entity as JurPerson;
                return <JurPersonInfoTable jurPerson={jurPerson} key={jurPerson.id}/>
            })
        }

        case Tables.USERS: {
            return results.map(entity=>{
                const user = entity as User;
                return <UserInfoTable user={user} key={user.id}/>
            })
        }
    }
}


const ResultsContainer = () => {
    const results = useAppSelector(state => state.searchResults)

    const table = useMemo(()=>results?.table,[results])

    if (!results) {
        return null;
    }

    return (
        <div className={"results-container"}>
            {results.length>0&&table?
                <>
                    <h4>Результатів: {results.length}</h4>
                    {getParsedResults(results)}
                </>
                :
                <h3 className=".text-center">Результатів не знайдено</h3>
            }
        </div>
    )
}

export default ResultsContainer