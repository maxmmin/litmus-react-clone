import React, {useContext} from "react";
import {LitmusServiceContext} from "../../App";
import Form from "react-bootstrap/Form";
import {keyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import {useAppSelector} from "../../../redux/hooks";

export default function FindByEmail () {
    const stateManager = useContext(LitmusServiceContext).exploration.stateManagers.user;

    const email = useAppSelector(state => state.exploration.user?.params.email);

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <input required={true} autoComplete={"new-password"} onChange={e=>{
                    stateManager.updateParams({email: e.currentTarget.value});
                }} className={`id form-control`} value={email} type="text" placeholder="Введіть email"
                       onKeyDown={keyPressHandler}
                />
            </Form.Group>
        </>
    )
}