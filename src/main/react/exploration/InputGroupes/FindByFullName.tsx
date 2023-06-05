import Form from "react-bootstrap/Form";
import React, {useMemo} from "react";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import {Entity, EntityExplorationParams} from "../../../redux/exploration/EntityExplorationState";
import ExplorationStateManager from "../../../redux/exploration/ExplorationStateManager";
import {EntityType} from "../../../model/EntityType";

type Params = {
    stateManager?: ExplorationStateManager<EntityType, EntityExplorationParams>
}

const FindByFullName = ({stateManager}: Params) => {


    if (!stateManager) return null;

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Прізвище</Form.Label>
                <input autoComplete={"new-password"} value={stateManager.getExplorationState().params.} onChange={e=>{
                    dispatch(setLocalInput({...localInput, lastName: e.currentTarget.value}))
                }} className={`last-name form-control`}  type="text" placeholder="Введіть прізвище"
                onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Ім'я</Form.Label>
                <input autoComplete={"new-password"} value={firstName}  onChange={e=>{
                    dispatch(setLocalInput({...localInput, firstName: e.currentTarget.value}))
                }} className={`first-name form-control`} type="text" placeholder="Введіть ім'я"
                       onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Ім'я по-батькові</Form.Label>
                <input autoComplete={"new-password"} value={middleName}  onChange={e=>{
                    dispatch(setLocalInput({...localInput, middleName: e.currentTarget.value}))
                }} className={`middle-name form-control`} type="text" placeholder="Введіть ім'я по-батькові"
                onKeyDown={keyPressHandler}
                />
            </Form.Group>
        </>
    )
}

export default FindByFullName;