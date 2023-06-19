import Form from "react-bootstrap/Form";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import React from "react";
import {useAppDispatch} from "../../../redux/hooks";
import UserCreationStateManager from "../../../service/creation/stateManager/user/UserCreationStateManager";
import CreationStateManagerFactory from "../../../service/creation/stateManager/CreationStateManagerFactory";
import store from "../../../redux/store";

const CreateUser = () => {
    const dispatch = useAppDispatch();

    const creationStateManager: UserCreationStateManager = CreationStateManagerFactory.getUserManager(store);
    // todo: this section
    return (
        <>
            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Email адреса</Form.Label>
                <input autoComplete={"new-password"} className={`email form-control`}  type="text" placeholder="Введіть EMAIL"
                       onKeyDown={keyPressHandler}
                       onChange={e=>{
                           creationStateManager.updateEntityCreationParams({email: e.currentTarget.value});
                       }}
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Прізвище</Form.Label>
                <input autoComplete={"new-password"} className={`lastName form-control`}  type="text" placeholder="Введіть прізвище"
                       onKeyDown={keyPressHandler}
                       onChange={e=>{
                           creationStateManager.updateEntityCreationParams({lastName: e.currentTarget.value});
                       }}
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Ім'я</Form.Label>
                <input autoComplete={"new-password"} className={`firstName form-control`} type="text" placeholder="Введіть ім'я"
                       onKeyDown={keyPressHandler}
                       onChange={e=>{
                           creationStateManager.updateEntityCreationParams({firstName: e.currentTarget.value});
                       }}
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Ім'я по-батькові</Form.Label>
                <input autoComplete={"new-password"} className={`middleName form-control`} type="text" placeholder="Введіть ім'я по-батькові"
                       onKeyDown={keyPressHandler}
                       onChange={e=>{
                           creationStateManager.updateEntityCreationParams({middleName: e.currentTarget.value});
                       }}
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Пароль</Form.Label>
                <input autoComplete={"new-password"} className={`passport-number form-control`} type="password" placeholder="Введіть пароль"
                       onKeyDown={keyPressHandler}
                       onChange={e=>{
                           creationStateManager.updateEntityCreationParams({password: e.currentTarget.value});
                       }}
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Повторіть пароль</Form.Label>
                <input autoComplete={"new-password"} className={`passport-number form-control`} type="password" placeholder="Повторіть пароль"
                       onKeyDown={keyPressHandler}
                />
            </Form.Group>
        </>
    )
}

export default CreateUser;