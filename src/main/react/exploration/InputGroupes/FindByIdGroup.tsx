import Form from "react-bootstrap/Form";
import React from "react";
import {useAppSelector} from "../../../redux/hooks";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import {getEntityExplorationStateManager} from "../../../util/getEntityExplorationService";
import InputError from "../../sharedComponents/InputError";

const FindByIdGroup = () => {
    const entity = useAppSelector(state => state.exploration?.exploredEntity)

    const stateManager = entity?getEntityExplorationStateManager(entity):null;


    const {id} = useAppSelector(() => stateManager?.getExplorationParams())||{}

    if (!entity||!stateManager) {
        return null;
    }

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>ID</Form.Label>
                <input required={true} pattern="[0-9]+" autoComplete={"new-password"} onChange={e=>{
                    if (!isNaN(+e.currentTarget.value)) {
                        stateManager.updateParams({id: e.currentTarget.value});
                    }
                }} className={`id form-control`} value={id} type="text" placeholder="Введіть id"
                onKeyDown={keyPressHandler}
                />
            </Form.Group>
        </>
    )
}

export default FindByIdGroup;