import Form from "react-bootstrap/Form";
import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import ExplorationStateManagerImpl from "../../../service/exploration/ExplorationStateManagerImpl";
import store from "../../../redux/store";

const FindByIdGroup = () => {
    const entity = useAppSelector(state => state.exploration?.exploredEntity)

    const stateManager = entity?ExplorationStateManagerImpl.getEntityManager(entity):null;

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
                    stateManager.updateParams({id: e.currentTarget.value});
                }} className={`id form-control`} value={id?id:''} type="text" placeholder="Введіть id"
                onKeyDown={keyPressHandler}
                />
            </Form.Group>
        </>
    )
}

export default FindByIdGroup;