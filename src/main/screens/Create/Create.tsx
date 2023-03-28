import Header from "../components/Header";
import {Form} from "react-bootstrap";
import {Tables} from "../../types/explorationParams";
import PrivateComponentWrapper from "../components/PrivateComponentWrapper";
import {Permissions} from "../../types/Role";
import {ForbiddenOutputCallbackModesEnum} from "../components/PrivateComponent";
import React, {ChangeEvent, useLayoutEffect, useMemo} from "react";
import {useAppDispatch} from "../../redux/hooks";
import {CreationParams, CreationParamsReducible, updateCreationParams} from "../../redux/actions/CreationParamsActions";
import CreationInputSection from "./CreationInputSection";
import {createEntity, getTableNameFromLocation} from "../../data/pureFunctions";
import {useLocation} from "react-router";
import apiLinks, {createAuthHeader, routingLinks} from "../../data/appConfig";
import {useNavigate} from "react-router-dom";
import CreateJurPersonDto from "../../types/CreateJurPersonDto";
import CreatePersonDto from "../../types/CreatePersonDto";
import CreateUserDto from "../../types/CreateUserDto";
import {create} from "domain";
import store from "../../redux/store";

export enum CreationModalModes {
    SET_OWNER = "SET_OWNER",
    SET_BEN_OWNER = "SET_BEN_OWNER",
    "SET_GEOLOCATION" = "SET_GEOLOCATION"
}

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

    const table = useMemo<Tables|null>(()=>getTableNameFromLocation(location.pathname), [location])

    useLayoutEffect(() => {
        if (table) {
            dispatch(updateCreationParams({table}))
        }
    }, [location])

    if (!table) {
        throw new Error("client error. table shouldn't be null. reload the page")
    }

    const createButtonOnClick = (creationParams: CreationParamsReducible, accessToken: string) => {
        if (creationParams) {
            const table = creationParams.table;

            const url = apiLinks[table]

            let body: CreateJurPersonDto | CreatePersonDto | CreateUserDto | null = null

            switch (table) {
                case Tables.JUR_PERSONS: {
                    body = creationParams.jurPersonCreationData
                    break;
                }

                case Tables.PERSONS: {
                    body = creationParams.personCreationData;
                    break;
                }

                case Tables.USERS: {
                    body = creationParams.userCreationData;
                    break;
                }
            }

            if (url && body) {
                    createEntity(url, body, accessToken)
                        .then(res => res.json())
                        .then(console.log)
            }

        }

    }

    return (
        <div className="creation-page">
            <Header backButtonPath={"/"}/>

            <main className={"creation-page__main-container"}>
               <div className="creation-page__create">
                       <div className="creation-page__create-select-wrapper">
                           <p style={{marginBottom: '10px'}}>Створити</p>
                           <Form.Select className={"create__select"} value={routingLinks.create[table]} onChange={handleSelectChange}>
                               <option value={routingLinks.create[Tables.PERSONS]}>Фізичну особу</option>
                               <option value={routingLinks.create[Tables.JUR_PERSONS]}>Юридичну особу</option>
                               <PrivateComponentWrapper neededPermissions={[Permissions.USERS_WRITE]} mode={ForbiddenOutputCallbackModesEnum.NO_OUTPUT}>
                                   <option value={routingLinks.create[Tables.USERS]}>Користувача</option>
                               </PrivateComponentWrapper>
                           </Form.Select>
                       </div>

                   <Form className={"creation-input-group"}>
                       <CreationInputSection table={table!}/>

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