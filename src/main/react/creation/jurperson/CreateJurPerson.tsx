import Form from "react-bootstrap/Form";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import React, {useContext, useEffect, useState} from "react";
import ApplyPersonModal from "../ApplyPersonModal";
import {useAppSelector} from "../../../redux/hooks";
import CreationGeoModal from "../geo/CreationGeoModal";
import {CreationModalSettings} from "../CreationScreen";
import InputDate from "../../sharedComponents/InputDate";
import Person, {getFullName} from "../../../model/human/person/Person";
import {DateEntityTool} from "../../../model/DateEntity";
import {CreationModalModes} from "../../../redux/types/creation/CreationModalModes";
import {Entity} from "../../../model/Entity";
import {LitmusServiceContext} from "../../App";
import InputError from "../../sharedComponents/InputError";
import Human from "../../../model/human/Human";


const getShortInfo = (person: Human&{id: number}): string => `${person.id}: ${getFullName(person)}`

const CreateJurPerson = () => {
    const [modalSettings, setModalSettings] = useState<CreationModalSettings>(null);

    const context = useContext(LitmusServiceContext);

    const creationStateManager = context.creation.stateManagers.jurPerson;

    const closeModal = () => setModalSettings(null)

    const jurPersonCreationParams = useAppSelector(state => state.creation?.jurPerson?.emergingEntity)

    const validationErrors = useAppSelector(state => state.creation.jurPerson?.validationErrors);

    const validationService = context.creation.validation.jurPerson;

    if (!jurPersonCreationParams) {
        throw new Error("createPersonDto was null but it shouldn't")
    }

    const {year, month, day} = jurPersonCreationParams.dateOfRegistration||{year: '', month: '', day: ''};

    useEffect(()=>{
        if (validationErrors?.dateOfRegistration) {
            const updatedDateOfRegistrationErr = validationService.validateDateOfRegistration(jurPersonCreationParams.dateOfRegistration);
            if (!updatedDateOfRegistrationErr) {
                creationStateManager.updateValidationErrors({dateOfRegistration: null})
            }
        }
    }, [jurPersonCreationParams.dateOfRegistration])

    useEffect(()=>{
        if (validationErrors?.name) {
            const updatedNameErr = validationService.validateName(jurPersonCreationParams.name);
            if (!updatedNameErr) {
                creationStateManager.updateValidationErrors({name: null})
            }
        }
    }, [jurPersonCreationParams.name])

    useEffect(()=>{
        if (validationErrors?.edrpou) {
            const updatedEdrpouErr = validationService.validateName(jurPersonCreationParams.edrpou);
            if (!updatedEdrpouErr) {
                creationStateManager.updateValidationErrors({edrpou: null})
            }
        }
    }, [jurPersonCreationParams.edrpou])


    return (
        <>
            <ApplyPersonModal modalSettings={modalSettings} close={closeModal}/>
            
            <CreationGeoModal entity={Entity.JUR_PERSON} show={modalSettings?.mode===CreationModalModes.SET_GEOLOCATION} close={closeModal}/>


                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>Назва</Form.Label>
                    <input value={jurPersonCreationParams.name} autoComplete={"new-password"} className={`name form-control ${validationErrors?.name?'is-invalid':''}`} type="text" placeholder="Введіть назву юридичної особи"
                           onKeyDown={keyPressHandler}
                           onChange={e=>{
                               creationStateManager.updateEntityCreationParams({name: e.currentTarget.value});
                           }}
                    />
                    <InputError error={validationErrors?.name}/>
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>ЄДРПОУ</Form.Label>
                    <input value={jurPersonCreationParams.edrpou?jurPersonCreationParams.edrpou:''} autoComplete={"new-password"} className={`${validationErrors?.edrpou?'is-invalid':''} edrpou form-control`} type="text" placeholder="Введіть ЄДРПОУ"
                           onKeyDown={keyPressHandler}
                           onChange={e=>{
                               creationStateManager.updateEntityCreationParams({edrpou: e.currentTarget.value});
                           }}
                    />
                    <InputError error={validationErrors?.edrpou}/>
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

                    <InputDate inputPrefix={validationErrors?.dateOfRegistration?'is-invalid':''} date={new DateEntityTool().setDay(day).setMonth(month).setYear(year).build()} setDate={date=>creationStateManager.updateEntityCreationParams({dateOfRegistration: date})} className={"date-of-registration"}/>

                    <InputError error={validationErrors?.dateOfRegistration}/>
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
)
}

export default CreateJurPerson;