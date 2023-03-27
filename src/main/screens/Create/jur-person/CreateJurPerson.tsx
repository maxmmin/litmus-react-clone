import Form from "react-bootstrap/Form";
import {DateBuilder, inputGroupsKeyPressHandler as keyPressHandler} from "../../../data/pureFunctions";
import React, {useMemo, useState} from "react";
import ApplyPersonModal from "../ApplyPersonModal";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import GetPersonDto from "../../../types/GetPersonDto";
import {Tables} from "../../../types/explorationParams";
import CreationGeoModal from "../geo/CreationGeoModal";
import {CreationModalModes, CreationModalSettings} from "../Create";
import apiLinks, {createAuthHeader} from "../../../data/appConfig";
import store from "../../../redux/store";
import {setPending, updateJurPersonCreationParams} from "../../../redux/actions/CreationParamsActions";
import InputDate from "../../components/InputDate";


const getShortInfo = (person: GetPersonDto): string => `${person.id}: ${person.lastName} ${person.firstName} ${person.middleName}`

const CreateJurPerson = () => {
    const [modalSettings, setModalSettings] = useState<CreationModalSettings>(null);

    const closeModal = () => setModalSettings(null)

    const createJurPersonDto = useAppSelector(state => state.creationParams?.jurPersonCreationData)

    const [year, month, day] = useMemo<string[]>(() => {
        const d = createJurPersonDto?.dateOfRegistration;
        if (d) {
            return d.split("-")
        }
        return new Array(3).fill("")
    }, [createJurPersonDto])

    const dispatch = useAppDispatch();

    if (!createJurPersonDto) {
        throw new Error("createPersonDto was null but it shouldn't")
    }

    const setDate = (date: DateBuilder) => {
        dispatch(updateJurPersonCreationParams({dateOfRegistration: date.buildStringDate()}))
    }

    return (
        <>
            <ApplyPersonModal modalSettings={modalSettings} close={closeModal}/>
            
            <CreationGeoModal table={Tables.JUR_PERSONS} show={modalSettings?.mode===CreationModalModes.SET_GEOLOCATION} close={closeModal}/>

            <>

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>Назва</Form.Label>
                    <input value={createJurPersonDto.name} autoComplete={"new-password"} className={`name form-control`} type="text" placeholder="Введіть назву юридичної особи"
                           onKeyDown={keyPressHandler}
                           onChange={e=>{
                               dispatch(updateJurPersonCreationParams({name: e.currentTarget.value}))
                           }}
                    />
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>ЄДРПОУ</Form.Label>
                    <input value={createJurPersonDto.edrpou} autoComplete={"new-password"} className={`edrpou form-control`} type="text" placeholder="Введіть ЄДРПОУ"
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
                           value={createJurPersonDto.owner?getShortInfo(createJurPersonDto.owner):"Додати особу"}
                    />
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>Бенефіціарний власник юридичної особи</Form.Label>
                    <input type={"button"} autoComplete={"new-password"} className={`jur-person-creation__input ben-owner form-control`} placeholder="Оберіть бенефіціарного власника юридичної особи"
                           onClick={()=>{
                               setModalSettings({mode: CreationModalModes.SET_BEN_OWNER})
                           }}
                           value={createJurPersonDto.benOwner?getShortInfo(createJurPersonDto.benOwner):"Додати особу"}
                    />
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item creation-input-group__item_long">
                    <Form.Label>Дата реєстрації юридичної особи</Form.Label>

                    <InputDate date={new DateBuilder().setDay(day).setMonth(month).setYear(year)} setDate={setDate} className={"date-of-registration"}/>

                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item creation-input-group__item_long">
                    <Form.Label>Адреса</Form.Label>
                    <input type={"button"} className={"jur-person-creation__input address form-control"} value={createJurPersonDto.address?createJurPersonDto.address.label:"Додати адресу"}
                        onClick={()=>{
                            setModalSettings({mode: CreationModalModes.SET_GEOLOCATION})
                        }}
                    />
                </Form.Group>

            </>
        </>
)
}

const createJurPerson =  async () => {
    store.dispatch(setPending(true))

    const result = await fetch(apiLinks[Tables.JUR_PERSONS], {
        headers: {
            ...createAuthHeader(store.getState().authentication?.accessToken!)
        },
        body: JSON.stringify(store.getState().creationParams?.jurPersonCreationData!)
    })

    if (result.ok) {
        console.log("ok")
    }

    store.dispatch(setPending(false))
}

export default CreateJurPerson;