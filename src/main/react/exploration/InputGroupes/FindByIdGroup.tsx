import Form from "react-bootstrap/Form";
import React from "react";
import {useAppSelector} from "../../../redux/hooks";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import {getEntityExplorationStateManager} from "../../../util/getEntityExplorationService";

const FindByIdGroup = () => {
    const entity = useAppSelector(state => state.exploration?.exploredEntity)

    const stateManager = entity?getEntityExplorationStateManager(entity):null;

    const validationErrors = useAppSelector(state => stateManager?.getValidationErrors()!);

    const {id} = useAppSelector(() => stateManager?.getExplorationParams())||{}

    if (!entity||!stateManager) {
        return null;
    }

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>ID</Form.Label>
                <input autoComplete={"new-password"} onChange={e=>{
                    if (validationErrors.id) {
                        stateManager.updateValidationErrors({id: undefined})
                    }
                    stateManager.updateParams({id: e.currentTarget.value});
                }} className={`id form-control ${validationErrors.id?"is-invalid":""}`} value={id?id:''} type="text" placeholder="Введіть id"
                onKeyDown={keyPressHandler}
                />
                {validationErrors.id?<p className={"error-text error-text_input-tip"}>{validationErrors.id}</p>:null}
            </Form.Group>
        </>
    )
}

export default FindByIdGroup;