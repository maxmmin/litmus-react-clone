import Form from "react-bootstrap/Form";
import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import ExplorationStateManager from "../../../service/exploration/ExplorationStateManager";
import store from "../../../redux/store";

const FindByIdGroup = () => {
    const entity = useAppSelector(state => state.exploration?.exploredEntity)

    if (!entity) return null;

    const stateManager = ExplorationStateManager.getEntityManager(store, entity);

    const {id} = stateManager.getExplorationState().params;

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
                    stateManager.updateParams({...prev, id: e.currentTarget.value});
                }} className={`id form-control`} value={id?id:''} type="text" placeholder="Введіть id"
                onKeyDown={keyPressHandler}
                />
            </Form.Group>
        </>
    )
}

export default FindByIdGroup;