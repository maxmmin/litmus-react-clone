import {Form} from "react-bootstrap";
import React, {ChangeEvent, useEffect} from "react";
import {Entity} from "../../model/Entity";
import ExplorationModeSelectContainer from "./ExplorationModesView";
import {useAppSelector} from "../../redux/hooks";
import PrivateComponentWrapper from "../authorization/PrivateComponentWrapper";
import {Permission} from "../../model/userIdentity/Role";
import {NO_OUTPUT} from "../authorization/PrivateComponent";
import {useNavigate} from "react-router-dom";
import appConfig from "../../config/appConfig";
import {useLocation, useParams} from "react-router";
import ExplorationInputForm from "./ExplorationInputForm";
import ExplorationStateManagerImpl from "../../service/stateManagers/exploration/ExplorationStateManagerImpl";
import store from "../../redux/store";
import ExplorationData from "./ExplorationData";
import EntityExplorationParams from "../../redux/types/exploration/EntityExplorationParams";
import {getEntityByDomain} from "../../util/pureFunctions";
import getEntityExplorationService, {getEntityExplorationStateManager} from "../../util/getEntityExplorationService";
import ExplorationStateManager from "../../service/stateManagers/exploration/ExplorationStateManager";
import EntityExplorationState from "../../redux/types/exploration/EntityExplorationState";


function getRequiredExplorationPermissions(exploredEntity: Entity|undefined): Permission[] {
    if (exploredEntity===Entity.USER) {
        return [Permission.DATA_READ];
    } else return [Permission.USERS_READ]
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
        // tslint:disable-next-line
    }, [location])

    const stateManager: ExplorationStateManager<unknown, EntityExplorationParams>|undefined = exploredEntity?getEntityExplorationStateManager(exploredEntity):undefined;

    const explorationState: EntityExplorationState<unknown, EntityExplorationParams>|undefined = useAppSelector(()=>stateManager?.getExplorationState());

    if (!exploredEntity||!explorationState||!stateManager) {
       return null;
    }

    const explorationService = getEntityExplorationService(exploredEntity);

    let requiredPermissions: Permission[] = getRequiredExplorationPermissions(exploredEntity);

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        navigate(event.currentTarget.value)
    }

    return (
       <PrivateComponentWrapper requiredPermissions={requiredPermissions} mode={"ERROR_PAGE"}>
           <div className={"explore-page"}>
               <main className={"explore-page__main"}>
                   <div className="explore-page__search">
                       <p style={{marginBottom: '10px'}}>Знайти</p>

                       <Form.Select className={"explore__select"} value={appConfig.applicationMappings.exploration[exploredEntity]} onChange={handleSelectChange}>
                           <option value={appConfig.applicationMappings.exploration[Entity.PERSON]}>Фізичну особу</option>
                           <option value={appConfig.applicationMappings.exploration[Entity.JUR_PERSON]}>Юридичну особу</option>
                           <PrivateComponentWrapper requiredPermissions={[Permission.USERS_READ]} mode={NO_OUTPUT}>
                               <option value={appConfig.applicationMappings.exploration[Entity.USER]}>Користувача</option>
                           </PrivateComponentWrapper>
                       </Form.Select>

                       <ExplorationModeSelectContainer explorationStateManager={stateManager}/>

                       <ExplorationInputForm onSubmit={(e: React.FormEvent) => {
                           e.preventDefault();
                           if ((e.currentTarget as HTMLFormElement).reportValidity()) {
                               stateManager?.setParams({...stateManager?.getExplorationParams(), i: 0});
                               explorationService.explore();
                           }
                       }} isPending={Boolean(explorationState?.isPending)} exploredEntity={exploredEntity}/>

                   </div>

                   <ExplorationData state={explorationState} exploredEntity={exploredEntity}/>
               </main>
           </div>
       </PrivateComponentWrapper>
    )
}

export default ExplorationScreen;