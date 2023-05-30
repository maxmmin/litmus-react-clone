import Form from "react-bootstrap/Form";
import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {BasicHumanSearchPayload} from "../../../redux/exploration/explorationParams";
import {setLocalInput} from "../../../redux/exploration/params/ExplorationParamsActions";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";

const FindByFullName = () => {
    const dispatch = useAppDispatch()
    const table = useAppSelector(state => state.explorationParams?.entity)

    const localInput = useAppSelector(state => {
        const globalInput = state.explorationParams?.input;
        if (table&&globalInput) {
            return globalInput[table] as BasicHumanSearchPayload;
        }
        return null;
    })

    const firstName = localInput?localInput.firstName:"";
    const middleName = localInput?localInput.middleName:"";
    const lastName = localInput?localInput.lastName:"";

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Прізвище</Form.Label>
                <input autoComplete={"new-password"} value={lastName} onChange={e=>{
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