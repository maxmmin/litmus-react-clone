import Header from "../header/Header";
import {Form} from "react-bootstrap";
import React, {ChangeEvent, useEffect} from "react";
import {Entity} from "../../model/Entity";
import ExplorationModeSelectContainer from "./ExplorationModesView";
import {useAppSelector} from "../../redux/hooks";
import PrivateComponentWrapper from "../authorization/PrivateComponentWrapper";
import Role, {Permissions, RoleName} from "../../redux/types/userIdentity/Role";
import {NO_OUTPUT} from "../authorization/PrivateComponent";
import {useNavigate} from "react-router-dom";
import appConfig from "../../config/appConfig";
import {useLocation, useParams} from "react-router";
import ExplorationInputForm from "./ExplorationInputForm";
import ExplorationStateManagerImpl from "../../service/exploration/stateManager/ExplorationStateManagerImpl";
import store from "../../redux/store";
import ExplorationData from "./ExplorationData";
import EntityExplorationState from "../../redux/types/exploration/EntityExplorationState";
import EntityExplorationParams from "../../redux/types/exploration/EntityExplorationParams";
import {getEntityByDomain} from "../../util/pureFunctions";
import getEntityExplorationService, {
    getEntityExplorationStateManager
} from "../../inversify/getEntityExplorationService";
import ExplorationStateManager from "../../service/exploration/stateManager/ExplorationStateManager";



function getRequiredPermissions(exploredEntity: Entity|undefined) {
    let requiredPermissions: Permissions[];

    switch (exploredEntity) {
        case Entity.PERSON:
            requiredPermissions = Role[RoleName.USER].permissions;
            break;
        case Entity.JUR_PERSON:
            requiredPermissions = Role[RoleName.USER].permissions;
            break;
        case Entity.USER:
            requiredPermissions = Role[RoleName.ADMIN].permissions;
            break;
        default: throw new Error("no permissions for such entity defined");
    }

    return requiredPermissions;
}

const ExplorationScreen = () => {
    const location = useLocation();

    const navigate = useNavigate();

    const exploredEntity = useAppSelector(state => state.exploration.exploredEntity);

    const {entityDomain}: {entityDomain?: string} = useParams<{entityDomain: string}>();

    useEffect(() => {
        let urlEntity: Entity|null = null;

        if (entityDomain) {
            urlEntity = getEntityByDomain(entityDomain)
        }

        if (!urlEntity) {
            if (exploredEntity) {
                navigate(appConfig.applicationMappings.exploration[exploredEntity])
            } else navigate(appConfig.applicationMappings.exploration.default);
        } else if (urlEntity!==exploredEntity) {
            ExplorationStateManagerImpl.switchEntity(urlEntity, store.dispatch);
        }
    }, [location])

    const explorationState = useAppSelector<EntityExplorationState<unknown, EntityExplorationParams>|undefined>(state => {
        if (exploredEntity) {
            switch (exploredEntity) {
                case Entity.PERSON:
                    return state.exploration.person;
                case Entity.JUR_PERSON:
                    return state.exploration.jurPerson;
                case Entity.USER:
                    return state.exploration.user;
                default: throw new Error("unknown entity: "+exploredEntity);
            }
        }   else return undefined;
    })

    if (!exploredEntity||!explorationState) {
       return null;
    }

    const stateManager: ExplorationStateManager<unknown, EntityExplorationParams> = getEntityExplorationStateManager(exploredEntity);

    let requiredPermissions: Permissions[] = getRequiredPermissions(exploredEntity);

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        navigate(event.currentTarget.value)
    }

    const explorationService = getEntityExplorationService(exploredEntity);

    return (
       <PrivateComponentWrapper requiredPermissions={requiredPermissions} mode={"ERROR_PAGE"}>
           <div className={"explore-page"}>
               <Header backButtonPath={"/"}/>
               <main className={"explore-page__main"}>
                   <div className="explore-page__search">
                       <p style={{marginBottom: '10px'}}>Знайти</p>

                       <Form.Select className={"explore__select"} value={appConfig.applicationMappings.exploration[exploredEntity]} onChange={handleSelectChange}>
                           <option value={appConfig.applicationMappings.exploration[Entity.PERSON]}>Фізичну особу</option>
                           <option value={appConfig.applicationMappings.exploration[Entity.JUR_PERSON]}>Юридичну особу</option>
                           <PrivateComponentWrapper requiredPermissions={[Permissions.USERS_READ]} mode={NO_OUTPUT}>
                               <option value={appConfig.applicationMappings.exploration[Entity.USER]}>Користувача</option>
                           </PrivateComponentWrapper>
                       </Form.Select>

                       <ExplorationModeSelectContainer explorationStateManager={stateManager}/>

                       <ExplorationInputForm onSubmit={(e: React.MouseEvent<HTMLButtonElement>) => {
                           explorationService.explore();
                       }} isPending={Boolean(explorationState?.isPending)} exploredEntity={exploredEntity}/>

                   </div>

                   <ExplorationData state={explorationState} exploredEntity={exploredEntity}/>
               </main>
           </div>
       </PrivateComponentWrapper>
    )
}

export default ExplorationScreen;