import Header from "../../components/Header";
import {Form} from "react-bootstrap";
import {Entity} from "../../../redux/exploration/EntityExplorationState";
import PrivateComponentWrapper from "../../components/PrivateComponentWrapper";
import {Permissions} from "../../../redux/userIdentity/Role";
import {NO_OUTPUT} from "../../components/PrivateComponent";
import React, {ChangeEvent, useLayoutEffect, useMemo} from "react";
import {useAppDispatch} from "../../../redux/hooks";
import {
    CreateJurPersonDto, CreatePersonDto, CreateUserDto,
    CreationParamsReducible,
    getCreateJurPersonDto, getCreatePersonDto, getCreateUserDto,
    updateCreationParams
} from "../../../redux/creation/CreationParamsActions";
import CreationInputSection from "./CreationInputSection";
import {
    createEntity,
    getTableNameFromLocation
} from "../../../util/pureFunctions";
import {useLocation} from "react-router";
import apiLinks, {routingLinks} from "../../../util/appConfig";
import {useNavigate} from "react-router-dom";
import store from "../../../redux/store";
import {CreationModalModes} from "../../../redux/creation/CreationModalModes";
import {BasicNotification, NotificationType, notificationTypes} from "../../../redux/applicationState/Notification";
import {addNotification} from "../../../redux/applicationState/AppStateActions";


export type CreationModalSettings = {
    mode: CreationModalModes
}   | null

const Creation = () => {
    const dispatch = useAppDispatch();

    const location = useLocation();

    const navigate = useNavigate();

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        navigate(event.currentTarget.value)
    }

    const entity = useMemo<Entity|null>(()=>getTableNameFromLocation(location.pathname), [location])

    useLayoutEffect(() => {
        if (entity) {
            dispatch(updateCreationParams({table: entity}))
        }
        /* eslint-disable-next-line */ // -f | DON'T DISABLE. LOCATION IS LOCAL STATE AND RELATIVE ENTITY SHOULD BE UPDATED ONLY ON IT'S CHANGE(no entity change)
    }, [location])

    if (!entity) {
        throw new Error("client error. table shouldn't be null. reload the page")
    }

    const createButtonOnClick = async (creationParams: CreationParamsReducible, accessToken: string) => {
        if (creationParams) {
            const table = creationParams.table;

            const url = apiLinks[table]

            let body: CreateJurPersonDto | CreatePersonDto | CreateUserDto | null = null

            switch (table) {
                case Entity.JUR_PERSONS: {
                    const creationData = creationParams.jurPersonCreationData;
                    body = getCreateJurPersonDto(creationData);
                    break;
                }

                case Entity.PERSONS: {
                    const creationData = creationParams.personCreationData;
                    body = getCreatePersonDto(creationData)
                    break;
                }

                case Entity.USERS: {
                    const creationData = creationParams.userCreationData;
                    body = getCreateUserDto(creationData);
                    break;
                }
            }

            if (url && body) {
                    let type: NotificationType;

                    const response = await createEntity(url, body, accessToken);

                    if (response.ok) {
                        type = notificationTypes.SUCCESS;
                    } else type = notificationTypes.ERROR;

                    const message: object = await response.json();

                    dispatch(addNotification({...new BasicNotification(type, JSON.stringify(message))}));
            }

        }

    }
    // @todo DO VALIDATION

    return (
        <div className="creation-page">
            <Header backButtonPath={"/"}/>

            <main className={"creation-page__main-container"}>
               <div className="creation-page__create">
                       <div className="creation-page__create-select-wrapper">
                           <p style={{marginBottom: '10px'}}>Створити</p>
                           <Form.Select className={"create__select"} value={routingLinks.create[entity]} onChange={handleSelectChange}>
                               <option value={routingLinks.create[Entity.PERSONS]}>Фізичну особу</option>
                               <option value={routingLinks.create[Entity.JUR_PERSONS]}>Юридичну особу</option>
                               <PrivateComponentWrapper neededPermissions={[Permissions.USERS_WRITE]} mode={NO_OUTPUT}>
                                   <option value={routingLinks.create[Entity.USERS]}>Користувача</option>
                               </PrivateComponentWrapper>
                           </Form.Select>
                       </div>

                   <Form className={"creation-input-group"}>
                       <CreationInputSection table={entity!}/>

                       <button onClick={event => {
                           event.preventDefault();
                           const state = store.getState();
                           createButtonOnClick(state.creationParams, state.authentication?.accessToken!)
                       }} className="creation-input-group__btn btn btn-primary">Створити</button>
                   </Form>
               </div>
            </main>
        </div>
    )
}

export default Creation;