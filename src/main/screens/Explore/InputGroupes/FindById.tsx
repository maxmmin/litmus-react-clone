import Form from "react-bootstrap/Form";
import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {setLocalInput, updateExplorationParams} from "../../../redux/actions/ExplorationParamsActions";
import {BasicHumanSearchPayload} from "../../../types/explorationParams";
import {searchInputGroupsKeyPressHandler as keyPressHandler} from "../../../data/pureFunctions";

const FindById = () => {
    const dispatch = useAppDispatch();

    const isInvalid = useAppSelector(state => state.explorationParams!.isInvalid)
    const table = useAppSelector(state => state.explorationParams?.table)

    const localInput = useAppSelector(state => {
        const globalInput = state.explorationParams?.input;
        if (table&&globalInput) {
            return globalInput[table] as BasicHumanSearchPayload;
        }
        return null;
    })

    const id = localInput?localInput.id:""

    useEffect(()=>{
        if (isNaN(+id!)) {
            if (!isInvalid) {
                dispatch(updateExplorationParams({isInvalid: true}))
            }
        } else if (isInvalid) {
            dispatch(updateExplorationParams({isInvalid: false}))
        }
    },[id])

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>ID</Form.Label>
                <input autoComplete={"new-password"} onChange={e=>{
                    dispatch(setLocalInput({...localInput, id: e.currentTarget.value}))
                }} className={`id form-control  ${isInvalid?"is-invalid":""}`} value={id} type="text" placeholder="Введіть id"
                onKeyDown={keyPressHandler}
                />
            </Form.Group>
        </>
    )
}

export default FindById;