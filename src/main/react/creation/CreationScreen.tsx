import Header from "../header/Header";
import {Form} from "react-bootstrap";
import {Entity} from "../../model/Entity";
import PrivateComponentWrapper from "../authorization/PrivateComponentWrapper";
import {Permissions} from "../../redux/types/userIdentity/Role";
import {NO_OUTPUT} from "../authorization/PrivateComponent";
import React, {ChangeEvent, useEffect, useMemo} from "react";
import CreationInputSection from "./CreationInputSection";
import {
    getEntityByDomain,
} from "../../util/pureFunctions";
import {useLocation, useParams} from "react-router";
import apiLinks, {routingLinks} from "../../config/appConfig";
import {useNavigate} from "react-router-dom";
import store from "../../redux/store";
import {CreationModalModes} from "../../redux/types/creation/CreationModalModes";
import appConfig from "../../config/appConfig";
import {useAppSelector} from "../../redux/hooks";
import ExplorationStateManagerImpl from "../../service/exploration/stateManager/ExplorationStateManagerImpl";
import CreationStateManagerImpl from "../../service/creation/stateManager/CreationStateManagerImpl";


export type CreationModalSettings = {
    mode: CreationModalModes
}   | null

const Creation = () => {
    const location = useLocation();

    const navigate = useNavigate();

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        console.log(event.currentTarget.value)
        navigate(event.currentTarget.value)
    }

    const {entityDomain}: {entityDomain?: string} = useParams<{entityDomain: string}>();

    const emergingEntity = useAppSelector(state => state.creation.emergingEntity);

    useEffect(() => {
        let urlEntity: Entity|null = null;

        if (entityDomain) {
            urlEntity = getEntityByDomain(entityDomain)
        }

        if (!urlEntity) {
            if (emergingEntity) {
                navigate(appConfig.applicationMappings.creation[emergingEntity])
            } else navigate(appConfig.applicationMappings.creation.default);
        } else if (urlEntity!==emergingEntity) {
            CreationStateManagerImpl.switchEntity(urlEntity, store.dispatch);
        }
    }, [location])

    // const createButtonOnClick = async (creationParams: CreationParamsReducible, accessToken: string) => {
    //     if (creationParams) {
    //         const table = creationParams.selectedEntity;
    //         // @todo creation manager
    //         // const url = apiLinks[table]
    //         //
    //         // let body: CreateJurPersonDto | CreatePersonDto | CreateUserDto | null = null
    //         //
    //         // switch (table) {
    //         //     case Entity.JUR_PERSON: {
    //         //         const creationData = creationParams.jurPersonCreationData;
    //         //         body = getCreateJurPersonDto(creationData);
    //         //         break;
    //         //     }
    //         //
    //         //     case Entity.PERSON: {
    //         //         const creationData = creationParams.personCreationData;
    //         //         body = getCreatePersonDto(creationData)
    //         //         break;
    //         //     }
    //         //
    //         //     case Entity.USER: {
    //         //         const creationData = creationParams.userCreationData;
    //         //         body = getCreateUserDto(creationData);
    //         //         break;
    //         //     }
    //         // }
    //
    //         // if (url && body) {
    //         //         let type: NotificationType;
    //         //
    //         //         const response = await createEntity(url, body, accessToken);
    //         //
    //         //         if (response.ok) {
    //         //             type = notificationTypes.SUCCESS;
    //         //         } else type = notificationTypes.ERROR;
    //         //
    //         //         const message: object = await response.json();
    //         //
    //         //         dispatch(addNotification({...new BasicNotification(type, JSON.stringify(message))}));
    //         // }
    //
    //     }
    //
    // }
    // // @todo DO VALIDATION
    if (!emergingEntity) return null;

    return (
        <div className="creation-page">
            <Header backButtonPath={"/"}/>

            <main className={"creation-page__main-container"}>
               <div className="creation-page__create">
                       <div className="creation-page__create-select-wrapper">
                           <p style={{marginBottom: '10px'}}>Створити</p>
                           <Form.Select className={"create__select"} value={appConfig.applicationMappings.creation[emergingEntity]} onChange={handleSelectChange}>
                               <option value={appConfig.applicationMappings.creation[Entity.PERSON]}>Фізичну особу</option>
                               <option value={appConfig.applicationMappings.creation[Entity.JUR_PERSON]}>Юридичну особу</option>
                               <PrivateComponentWrapper requiredPermissions={[Permissions.USERS_WRITE]} mode={NO_OUTPUT}>
                                   <option value={appConfig.applicationMappings.creation[Entity.USER]}>Користувача</option>
                               </PrivateComponentWrapper>
                           </Form.Select>
                       </div>

                   <Form className={"creation-input-group"}>
                       <CreationInputSection entity={emergingEntity}/>

                       <button onClick={event => {
                           event.preventDefault();
                           const state = store.getState();
                           // createButtonOnClick(state.creation, state.authentication?.accessToken!)
                       }} className="creation-input-group__btn btn btn-primary">Створити</button>
                   </Form>
               </div>
            </main>
        </div>
    )
}

export default Creation;