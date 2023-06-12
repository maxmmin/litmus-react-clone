import Form from "react-bootstrap/Form";
import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import ExplorationStateManager from "../../../service/exploration/ExplorationStateManager";
import store from "../../../redux/store";

const FindByIdGroup = () => {
    const entity = useAppSelector(state => state.exploration?.exploredEntity)

    const stateManager = entity?ExplorationStateManager.getEntityManager(store, entity):null;

    const {id} = useAppSelector(() => stateManager?.getExplorationParams())||{}

    if (!entity||!stateManager) {
        return null;
    }

    // useEffect(()=>{
    //     if (isNaN(+id!)) {
    //         if (!isInvalid) {
    //             dispatch(updateExplorationParams({isInvalid: true}))
    //         }
    //     } else if (isInvalid) {
    //         dispatch(updateExplorationParams({isInvalid: false}))
    //     }
    // },[id, isInvalid])


    // ${isInvalid?"is-invalid":""}`}
    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>ID</Form.Label>
                <input autoComplete={"new-password"} onChange={e=>{
                    const prev = stateManager.getExplorationState().params;
                    stateManager.setParams({...prev, id: e.currentTarget.value});
                }} className={`id form-control`} value={id?id:''} type="text" placeholder="Введіть id"
                onKeyDown={keyPressHandler}
                />
            </Form.Group>
        </>
    )
}

export default FindByIdGroup;