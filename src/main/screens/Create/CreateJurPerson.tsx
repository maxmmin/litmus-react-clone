import Form from "react-bootstrap/Form";
import {setLocalInput} from "../../redux/actions/ExplorationParamsActions";
import {searchInputGroupsKeyPressHandler as keyPressHandler} from "../../data/pureFunctions";
import React, {useState} from "react";
import ApplyPersonModal from "./ApplyPersonModal";
import {useAppSelector} from "../../redux/hooks";
import GetPersonDto from "../../types/GetPersonDto";

export enum ModalMode {
    SET_OWNER = "SET_OWNER",
    SET_BEN_OWNER = "SET_BEN_OWNER"
}

export type ModalSettings = {
    mode: ModalMode
}   | null

const getShortInfo = (person: GetPersonDto): string => `${person.id}: ${person.lastName} ${person.firstName} ${person.middleName}`

const CreateJurPerson = () => {
    const [modalSettings, setModalSettings] = useState<ModalSettings>(null);

    const owner = useAppSelector(state => state.creationParams?.jurPersonCreationData.owner)

    const benOwner = useAppSelector(state => state.creationParams?.jurPersonCreationData.benOwner)

    return (
        <>
            <ApplyPersonModal modalSettings={modalSettings} setModalSettings={setModalSettings}/>

            <Form className="creation-input-group">

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>Назва</Form.Label>
                    <input autoComplete={"new-password"} className={`name form-control`} type="text" placeholder="Введіть назву юридичної особи"
                           onKeyDown={keyPressHandler}
                    />
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>ЄДРПОУ</Form.Label>
                    <input autoComplete={"new-password"} className={`edrpou form-control`} type="text" placeholder="Введіть ЄДРПОУ"
                           onKeyDown={keyPressHandler}
                    />
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>Власник юридичної особи</Form.Label>
                    <input type={"button"} autoComplete={"new-password"} className={`jur-person-creation__input owner form-control`} placeholder="Оберіть власника юридичної особи"
                           onClick={()=>{
                               setModalSettings({mode: ModalMode.SET_OWNER})
                           }}
                           value={owner?getShortInfo(owner):"Додати особу"}
                    />
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>Бенефіціарний власник юридичної особи</Form.Label>
                    <input type={"button"} autoComplete={"new-password"} className={`jur-person-creation__input ben-owner form-control`} placeholder="Оберіть бенефіціарного власника юридичної особи"
                           onClick={()=>{
                               setModalSettings({mode: ModalMode.SET_BEN_OWNER})
                           }}
                           value={benOwner?getShortInfo(benOwner):"Додати особу"}
                    />
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>Дата реєстрації юридичної особи</Form.Label>

                    <div className="date-container date-of-registration">
                        <input autoComplete={"new-password"} className={`date-container__item date-of-registration__input date-of-registration__input_year form-control`} type="text" placeholder="YYYY"
                               onKeyDown={keyPressHandler}
                        />

                        <input autoComplete={"new-password"} className={`date-container__item date-of-registration__input date-of-registration__input_month form-control`} type="text" placeholder="MM"
                               onKeyDown={keyPressHandler}
                        />

                        <input autoComplete={"new-password"} className={`date-container__item date-of-registration__input date-of-registration__input_day form-control`} type="text" placeholder="DD"
                               onKeyDown={keyPressHandler}
                        />
                    </div>

                </Form.Group>

                <button className="creation-input-group__btn btn btn-primary">Створити юридичну особу</button>

            </Form>
        </>
)
}

export default CreateJurPerson;