import Header from "../components/Header";
import {Form} from "react-bootstrap";
import {Tables} from "../../types/explorationParams";
import PrivateComponentWrapper from "../components/PrivateComponentWrapper";
import {Permissions} from "../../types/Role";
import {ForbiddenOutputCallbackModesEnum} from "../components/PrivateComponent";
import React, {ChangeEvent, useEffect, useLayoutEffect, useMemo} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {updateExplorationParams} from "../../redux/actions/ExplorationParamsActions";
import {updateCreationParams} from "../../redux/actions/CreationParamsActions";
import CreationInputSection from "./CreationInputSection";
import {getTableNameFromLocation} from "../../data/pureFunctions";
import {useLocation} from "react-router";
import {routingLinks} from "../../data/appConfig";
import {useNavigate} from "react-router-dom";

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

                       <button className="creation-input-group__btn btn btn-primary">Створити</button>
                   </Form>
               </div>
            </main>
        </div>
    )
}

export default Creation;