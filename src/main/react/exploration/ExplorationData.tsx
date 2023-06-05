import {Entity} from "../../redux/exploration/Entity";
import {MutableRefObject} from "react";
import PersonInfoTable from "./EntityTables/PersonInfoTable";
import JurPersonInfoTable from "./EntityTables/JurPersonInfoTable";
import UserInfoTable from "./EntityTables/UserInfoTable";
import Loader from "../loader/Loader";
import {getJurPersonFromEntity, getPersonFromResponse, getUserFromResponse} from "../../util/pureFunctions";
import ExplorationStateManager from "../../redux/exploration/ExplorationStateManager";
import store from "../../redux/store";

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
    containerRef: MutableRefObject<HTMLDivElement|null>,
    exploredEntity: Entity
}

const ExplorationData = ({containerRef, exploredEntity}: Props) => {

    const manager = ExplorationStateManager.getEntityManager(store,exploredEntity);

    const entity = manager.entity;

    const data = manager.getExplorationData();

    const results = data.results;

    if (!results) return null;

    return (
        <div className={"results-container"} ref={containerRef}>
            {results.length>0?
                <>
                    <h4>Результатів: {results.length}</h4>
                    {getProcessedResults(entity,results)}
                </>
                :
                data.isPending?null:<h3 className=".text-center">Результатів не знайдено</h3>
            }
            {data.isPending?<Loader/>:null}
        </div>
    )
}

export default ExplorationData