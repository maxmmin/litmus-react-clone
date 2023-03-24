import Form from "react-bootstrap/Form";
import {searchInputGroupsKeyPressHandler as keyPressHandler} from "../../../data/pureFunctions";
import React, {useState} from "react";
import ApplyPersonModal from "../ApplyPersonModal";
import {useAppSelector} from "../../../redux/hooks";
import GetPersonDto from "../../../types/GetPersonDto";
import {Tables} from "../../../types/explorationParams";
import CreationGeoModal from "../geo/CreationGeoModal";
import {CreationModalModes, CreationModalSettings} from "../Create";
import apiLinks, {createAuthHeader} from "../../../data/appConfig";
import store from "../../../redux/store";
import {setPending} from "../../../redux/actions/CreationParamsActions";


const getShortInfo = (person: GetPersonDto): string => `${person.id}: ${person.lastName} ${person.firstName} ${person.middleName}`

const CreateJurPerson = () => {
    const [modalSettings, setModalSettings] = useState<CreationModalSettings>(null);

    const closeModal = () => setModalSettings(null)

    const owner = useAppSelector(state => state.creationParams?.jurPersonCreationData.owner)

    const benOwner = useAppSelector(state => state.creationParams?.jurPersonCreationData.benOwner)
    
    const address = useAppSelector(state => state.creationParams?.jurPersonCreationData.address)

    return (
        <>
            <ApplyPersonModal modalSettings={modalSettings} close={closeModal}/>
            
            <CreationGeoModal table={Tables.JUR_PERSONS} show={modalSettings?.mode===CreationModalModes.SET_GEOLOCATION} close={closeModal}/>

            <>

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
                               setModalSettings({mode: CreationModalModes.SET_OWNER})
                           }}
                           value={owner?getShortInfo(owner):"Додати особу"}
                    />
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>Бенефіціарний власник юридичної особи</Form.Label>
                    <input type={"button"} autoComplete={"new-password"} className={`jur-person-creation__input ben-owner form-control`} placeholder="Оберіть бенефіціарного власника юридичної особи"
                           onClick={()=>{
                               setModalSettings({mode: CreationModalModes.SET_BEN_OWNER})
                           }}
                           value={benOwner?getShortInfo(benOwner):"Додати особу"}
                    />
                </Form.Group>

                <Form.Group className="mb-3 creation-input-group__item creation-input-group__item_long">
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

                <Form.Group className="mb-3 creation-input-group__item creation-input-group__item_long">
                    <Form.Label>Адреса</Form.Label>
                    <input type={"button"} className={"jur-person-creation__input address form-control"} value={address?address.label:"Додати адресу"}
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