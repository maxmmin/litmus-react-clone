import Form from "react-bootstrap/Form";
import {setLocalInput} from "../../redux/actions/ExplorationParamsActions";
import {searchInputGroupsKeyPressHandler as keyPressHandler} from "../../data/pureFunctions";
import React from "react";

const CreateJurPerson = () => {
    return (
        <>

            <Form.Group className="mb-3">
                <Form.Label>Назва</Form.Label>
                <input autoComplete={"new-password"} className={`name form-control`} type="text" placeholder="Введіть назву юридичної особи"
                    onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>ЄДРПОУ</Form.Label>
                <input autoComplete={"new-password"} className={`middleName form-control`} type="text" placeholder="Введіть ЄДРПОУ"
                    onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Власник юридичної особи</Form.Label>
                <input autoComplete={"new-password"} className={`passport-number form-control`} type="text" placeholder="Оберіть власника юридичної особи"
                onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Бенефіціарний власник юридичної особи</Form.Label>
                <input autoComplete={"new-password"} className={`passport-number form-control`} type="text" placeholder="Оберіть бенефіціарного власника юридичної особи"
                       onKeyDown={keyPressHandler}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Дата регістрації юридичної особи</Form.Label>

                <div className="date-of-registration">
                    <input autoComplete={"new-password"} className={`date-of-registration__input date-of-registration__input_year form-control`} type="text" placeholder="YYYY"
                        onKeyDown={keyPressHandler}
                    />
        
                    <input autoComplete={"new-password"} className={`date-of-registration__input date-of-registration__input_month form-control`} type="text" placeholder="MM"
                        onKeyDown={keyPressHandler}
                    />
        
                    <input autoComplete={"new-password"} className={`date-of-registration__input date-of-registration__input_day form-control`} type="text" placeholder="DD"
                        onKeyDown={keyPressHandler}
                    />
            </div>

            </Form.Group>

            //@todo place
    </>
)
}

export default CreateJurPerson;