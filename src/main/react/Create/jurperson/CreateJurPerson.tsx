import Form from "react-bootstrap/Form";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../../util/pureFunctions";
import React, {useState} from "react";
import ApplyPersonModal from "../ApplyPersonModal";
import {useAppDispatch, useAppSelector} from "../../../../redux/hooks";
import {Entity} from "../../../../redux/exploration/EntityExplorationState";
import CreationGeoModal from "../geo/CreationGeoModal";
import {CreationModalSettings} from "../Create";
import {updateJurPersonCreationParams} from "../../../../redux/creation/CreationParamsActions";
import InputDate from "../../general/InputDate";
import Person from "../../../../model/person/Person";
import DateEntity, {DateBuilder} from "../../../../model/DateEntity";
import {CreationModalModes} from "../../../../redux/creation/CreationModalModes";


const getShortInfo = (person: Person): string => `${person.id}: ${person.lastName} ${person.firstName} ${person.middleName}`

const CreateJurPerson = () => {
    const [modalSettings, setModalSettings] = useState<CreationModalSettings>(null);

    const closeModal = () => setModalSettings(null)

    const jurPersonCreationData = useAppSelector(state => state.creationParams?.jurPersonCreationData)

    const {year, month, day} = jurPersonCreationData!.dateOfRegistration

    const dispatch = useAppDispatch();

    if (!jurPersonCreationData) {
        throw new Error("createPersonDto was null but it shouldn't")
    }

    const setDate = (date: DateEntity) => {
        dispatch(updateJurPersonCreationParams({dateOfRegistration: date}))
    }

    return (
        <>
            <ApplyPersonModal modalSettings={modalSettings} close={closeModal}/>
            
            <CreationGeoModal entity={Entity.JUR_PERSON} show={modalSettings?.mode===CreationModalModes.SET_GEOLOCATION} close={closeModal}/>

            <>

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>Назва</Form.Label>
                    <input value={jurPersonCreationData.name} autoComplete={"new-password"} className={`name form-control`} type="text" placeholder="Введіть назву юридичної особи"
                           onKeyDown={keyPressHandler}
                           onChange={e=>{
                               dispatch(updateJurPersonCreationParams({name: e.currentTarget.value}))
                           }}
                    />
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>ЄДРПОУ</Form.Label>
                    <input value={jurPersonCreationData.edrpou} autoComplete={"new-password"} className={`edrpou form-control`} type="text" placeholder="Введіть ЄДРПОУ"
                           onKeyDown={keyPressHandler}
                           onChange={e=>{
                               dispatch(updateJurPersonCreationParams({edrpou: e.currentTarget.value}))
                           }}
                    />
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>Власник юридичної особи</Form.Label>
                    <input type={"button"} autoComplete={"new-password"} className={`jur-person-creation__input owner form-control`} placeholder="Оберіть власника юридичної особи"
                           onClick={()=>{
                               setModalSettings({mode: CreationModalModes.SET_OWNER})
                           }}
                           value={jurPersonCreationData.owner?getShortInfo(jurPersonCreationData.owner):"Додати особу"}
                    />
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>Бенефіціарний власник юридичної особи</Form.Label>
                    <input type={"button"} autoComplete={"new-password"} className={`jur-person-creation__input ben-owner form-control`} placeholder="Оберіть бенефіціарного власника юридичної особи"
                           onClick={()=>{
                               setModalSettings({mode: CreationModalModes.SET_BEN_OWNER})
                           }}
                           value={jurPersonCreationData.benOwner?getShortInfo(jurPersonCreationData.benOwner):"Додати особу"}
                    />
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item creation-input-group__item_long">
                    <Form.Label>Дата реєстрації юридичної особи</Form.Label>

                    <InputDate date={new DateBuilder().setDay(day).setMonth(month).setYear(year).build()} setDate={setDate} className={"date-of-registration"}/>

                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item creation-input-group__item_long">
                    <Form.Label>Адреса</Form.Label>
                    <input type={"button"} className={"jur-person-creation__input address form-control"}
                           value={jurPersonCreationData.location?jurPersonCreationData.location.address:"Додати адресу"}
                        onClick={()=>{
                            setModalSettings({mode: CreationModalModes.SET_GEOLOCATION})
                        }}
                    />
                </Form.Group>

            </>
        </>
)
}

export default CreateJurPerson;