import Form from "react-bootstrap/Form";
import {setLocalInput} from "../../redux/actions/ExplorationParamsActions";
import {searchInputGroupsKeyPressHandler as keyPressHandler} from "../../data/pureFunctions";
import React from "react";

const CreatePerson = () => {
    return (
        <Form className={"creation-input-group"}>
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
                <Form.Label>Номер паспорта</Form.Label>
                <input autoComplete={"new-password"} className={`passport-number form-control`} type="text" placeholder="Введіть номер паспорта"
                       onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Серія паспорта</Form.Label>
                <input autoComplete={"new-password"} className={`passport-serial form-control`} type="text" placeholder="Введіть серію паспорта"
                       onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>РНОКПП</Form.Label>
                <input autoComplete={"new-password"} className={`rnokpp-code form-control`} type="text" placeholder="Введіть РНОКПП"
                       onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Дата народження</Form.Label>

                <div className="date-of-birth date-container">
                    <input autoComplete={"new-password"} className={`date-container__item date-of-birth__input date-of-birth__input_year form-control`} type="text" placeholder="YYYY"
                           onKeyDown={keyPressHandler}
                    />

                    <input autoComplete={"new-password"} className={`date-container__item date-of-birth__input date-of-birth__input_month form-control`} type="text" placeholder="MM"
                           onKeyDown={keyPressHandler}
                    />

                    <input autoComplete={"new-password"} className={`date-container__item date-of-birth__input date-of-birth__input_day form-control`} type="text" placeholder="DD"
                           onKeyDown={keyPressHandler}
                    />
                </div>
            </Form.Group>

            <button className="creation-input-group__btn btn btn-primary">Створити фізичну особу</button>

    </Form>
    )
}

export default CreatePerson;