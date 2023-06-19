import Form from "react-bootstrap/Form";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import React, {useState} from "react";
import ApplyPersonModal from "../ApplyPersonModal";
import {useAppSelector} from "../../../redux/hooks";
import CreationGeoModal from "../geo/CreationGeoModal";
import {CreationModalSettings} from "../CreationScreen";
import InputDate from "../../common/InputDate";
import Person from "../../../model/human/person/Person";
import {DateBuilder} from "../../../model/DateEntity";
import {CreationModalModes} from "../../../redux/types/creation/CreationModalModes";
import {Entity} from "../../../model/Entity";
import CreationStateManagerFactory from "../../../service/creation/stateManager/CreationStateManagerFactory";


const getShortInfo = (person: Person): string => `${person.id}: ${person.lastName} ${person.firstName} ${person.middleName}`

const CreateJurPerson = () => {
    const [modalSettings, setModalSettings] = useState<CreationModalSettings>(null);

    const closeModal = () => setModalSettings(null)

    const jurPersonCreationParams = useAppSelector(state => state.creation?.jurPerson?.params)

    if (!jurPersonCreationParams) {
        throw new Error("createPersonDto was null but it shouldn't")
    }

    const creationManager = CreationStateManagerFactory.getJurPersonManager();

    const {year, month, day} = jurPersonCreationParams.dateOfRegistration;

    return (
        <>
            <ApplyPersonModal modalSettings={modalSettings} close={closeModal}/>
            
            <CreationGeoModal entity={Entity.JUR_PERSON} show={modalSettings?.mode===CreationModalModes.SET_GEOLOCATION} close={closeModal}/>

            <>

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>Назва</Form.Label>
                    <input value={jurPersonCreationParams.name} autoComplete={"new-password"} className={`name form-control`} type="text" placeholder="Введіть назву юридичної особи"
                           onKeyDown={keyPressHandler}
                           onChange={e=>{
                               creationManager.updateEntityCreationParams({name: e.currentTarget.value});
                           }}
                    />
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>ЄДРПОУ</Form.Label>
                    <input value={jurPersonCreationParams.edrpou} autoComplete={"new-password"} className={`edrpou form-control`} type="text" placeholder="Введіть ЄДРПОУ"
                           onKeyDown={keyPressHandler}
                           onChange={e=>{
                               creationManager.updateEntityCreationParams({edrpou: e.currentTarget.value});
                           }}
                    />
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>Власник юридичної особи</Form.Label>
                    <input type={"button"} autoComplete={"new-password"} className={`jur-person-creation__input owner form-control`} placeholder="Оберіть власника юридичної особи"
                           onClick={()=>{
                               setModalSettings({mode: CreationModalModes.SET_OWNER})
                           }}
                           value={jurPersonCreationParams.owner?getShortInfo(jurPersonCreationParams.owner):"Додати особу"}
                    />
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>Бенефіціарний власник юридичної особи</Form.Label>
                    <input type={"button"} autoComplete={"new-password"} className={`jur-person-creation__input ben-owner form-control`} placeholder="Оберіть бенефіціарного власника юридичної особи"
                           onClick={()=>{
                               setModalSettings({mode: CreationModalModes.SET_BEN_OWNER})
                           }}
                           value={jurPersonCreationParams.benOwner?getShortInfo(jurPersonCreationParams.benOwner):"Додати особу"}
                    />
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item creation-input-group__item_long">
                    <Form.Label>Дата реєстрації юридичної особи</Form.Label>

                    <InputDate date={new DateBuilder().setDay(day).setMonth(month).setYear(year).build()} setDate={date=>creationManager.updateEntityCreationParams({dateOfRegistration: date})} className={"date-of-registration"}/>

                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item creation-input-group__item_long">
                    <Form.Label>Адреса</Form.Label>
                    <input type={"button"} className={"jur-person-creation__input address form-control"}
                           value={jurPersonCreationParams.location?jurPersonCreationParams.location.address:"Додати адресу"}
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