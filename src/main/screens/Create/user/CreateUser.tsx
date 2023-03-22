import Form from "react-bootstrap/Form";
import {setLocalInput} from "../../../redux/actions/ExplorationParamsActions";
import {searchInputGroupsKeyPressHandler as keyPressHandler} from "../../../data/pureFunctions";
import React from "react";

const CreateUser = () => {
    return (
        <Form className="creation-input-group">
            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Email адреса</Form.Label>
                <input autoComplete={"new-password"} className={`email form-control`}  type="text" placeholder="Введіть EMAIL"
                       onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Прізвище</Form.Label>
                <input autoComplete={"new-password"} className={`lastName form-control`}  type="text" placeholder="Введіть прізвище"
                       onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Ім'я</Form.Label>
                <input autoComplete={"new-password"} className={`firstName form-control`} type="text" placeholder="Введіть ім'я"
                       onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Ім'я по-батькові</Form.Label>
                <input autoComplete={"new-password"} className={`middleName form-control`} type="text" placeholder="Введіть ім'я по-батькові"
                       onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Пароль</Form.Label>
                <input autoComplete={"new-password"} className={`passport-number form-control`} type="password" placeholder="Введіть пароль"
                       onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <button className="creation-input-group__btn btn btn-primary">Створити обліковий запис користувача</button>
        </Form>
    )
}

export default CreateUser;