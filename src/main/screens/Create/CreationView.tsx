import Header from "../components/Header";
import {Form} from "react-bootstrap";
import {Tables} from "../../types/explorationParams";
import PrivateComponentWrapper from "../components/PrivateComponentWrapper";
import {Permissions} from "../../types/Role";
import {ForbiddenOutputCallbackModesEnum} from "../components/PrivateComponent";
import React, {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {updateExplorationParams} from "../../redux/actions/ExplorationParamsActions";
import {updateCreationParams} from "../../redux/actions/CreationParamsActions";
import CreationInputSection from "./CreationInputSection";

export enum CreationModalModes {
    SET_OWNER = "SET_OWNER",
    SET_BEN_OWNER = "SET_BEN_OWNER",
    "SET_GEOLOCATION" = "SET_GEOLOCATION"
}

export type CreationModalSettings = {
    mode: CreationModalModes
}   | null

const CreationView = () => {
    const dispatch = useAppDispatch();

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        const table: Tables = event.currentTarget.value as Tables;
        dispatch(updateCreationParams({table: table}))
    }

    const table = useAppSelector(state => state.creationParams?.table)

    useEffect(()=>{
        if (!table) {
            dispatch(updateExplorationParams({table: Tables.PERSONS}))
        }
    }, [table])

    return (
        <div className="creation-page">
            <Header backButtonPath={"/"}/>

            <main className={"creation-page__main-container"}>
               <div className="creation-page__creation-container">
                   <div className="creation-page__create-select-wrapper">
                       <p style={{marginBottom: '10px'}}>Створити</p>
                       <Form.Select className={"create__select"} value={table} onChange={handleSelectChange}>
                           <option value={Tables.PERSONS}>Фізичну особу</option>
                           <option value={Tables.JUR_PERSONS}>Юридичну особу</option>
                           <PrivateComponentWrapper neededPermissions={[Permissions.USERS_WRITE]} mode={ForbiddenOutputCallbackModesEnum.NO_OUTPUT}>
                               <option value={Tables.USERS}>Користувача</option>
                           </PrivateComponentWrapper>
                       </Form.Select>
                   </div>

                   <CreationInputSection table={table!}/>
               </div>
            </main>
        </div>
    )
}

export default CreationView;