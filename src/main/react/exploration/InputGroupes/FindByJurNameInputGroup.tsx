import JurPersonExplorationStateManager
    from "../../../service/stateManagers/exploration/jurPerson/JurPersonExplorationStateManager";
import React, {useContext} from "react";
import {LitmusServiceContext} from "../../App";
import Form from "react-bootstrap/Form";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import {useSelector} from "react-redux";

export default function () {
    const stateManager: JurPersonExplorationStateManager = useContext(LitmusServiceContext).exploration.stateManagers.jurPerson;

    const name = useSelector(()=>stateManager.getExplorationParams().name);

    return (
        <Form.Group className="mb-3">
            <Form.Label>Назва</Form.Label>
            <input required={true} autoComplete={"new-password"} onChange={e=>{
                stateManager.updateParams({name: e.currentTarget.value});
            }} className={`id form-control`} value={name} type="text" placeholder="Введіть назву"
                   onKeyDown={keyPressHandler}
            />
        </Form.Group>
    )
}