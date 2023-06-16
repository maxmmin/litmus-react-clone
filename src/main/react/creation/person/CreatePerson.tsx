import Form from "react-bootstrap/Form";
import {
    inputBeforeDateContainerHandler,
    inputGroupsKeyPressHandler as keyPressHandler
} from "../../../util/pureFunctions";
import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import InputDate from "../../common/InputDate";
import {CreationModalSettings} from "../CreationScreen";
import CreationGeoModal from "../geo/CreationGeoModal";
import DateEntity, {DateBuilder} from "../../../model/DateEntity";
import Sex from "../../../model/human/person/Sex";
import {CrossIcon} from "../../../util/icons";
import ApplyPersonModal from "../ApplyPersonModal";
import {CreationModalModes} from "../../../redux/creation/CreationModalModes";
import PersonRelationships from "./PersonRelationships";
import {Entity} from "../../../model/Entity";
import CreationStateManagerImpl from "../../../service/creation/CreationStateManagerImpl";

const CreatePerson = () => {
    const [modalSettings, setModalSettings] = useState<CreationModalSettings>(null);

    const creationPersonParams = useAppSelector(state => state.creation?.person?.params)

    const dispatch = useAppDispatch();

    if (!creationPersonParams) {
        throw new Error("createPersonDto was null but it shouldn't be")
    }

    const {year, month, day} = creationPersonParams!.dateOfBirth;

    const passportData = creationPersonParams?.passportData;

    const relationships = creationPersonParams?.relationships;

    const creationStateManager = CreationStateManagerImpl.getPersonManager();

    const closeModal = () => setModalSettings(null)

    return (
        <>
            <CreationGeoModal entity={Entity.PERSON} show={modalSettings?.mode===CreationModalModes.SET_GEOLOCATION} close={closeModal}/>

            <ApplyPersonModal modalSettings={modalSettings} close={closeModal}/>

            <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>Прізвище</Form.Label>
                    <input value={creationPersonParams.lastName} autoComplete={"new-password"} className={`lastName form-control`}  type="text" placeholder="Введіть прізвище"
                        onKeyDown={keyPressHandler}
                        onChange={e => {
                            creationStateManager.updateEntityCreationParams({lastName: e.currentTarget.value})
                            }
                        }
                    />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Ім'я</Form.Label>
                <input value={creationPersonParams.firstName} autoComplete={"new-password"} className={`firstName form-control`} type="text" placeholder="Введіть ім'я"
                    onKeyDown={keyPressHandler}
                       onChange={e => {
                           creationStateManager.updateEntityCreationParams({firstName: e.currentTarget.value})
                        }
                       }
                    />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Ім'я по-батькові</Form.Label>
                <input value={creationPersonParams.middleName} autoComplete={"new-password"} className={`middleName form-control`} type="text" placeholder="Введіть ім'я по-батькові"
                    onKeyDown={keyPressHandler}
                       onChange={e => {
                           creationStateManager.updateEntityCreationParams({middleName: e.currentTarget.value})
                        }
                       }
                />
            </Form.Group>

           <Form.Group className="mb-3 creation-input-group__item">
               <p className="m-0">Стать</p>

               <div className="form-check">
                   <input className="form-check-input maleRadioBtn" type="radio" checked={creationPersonParams.sex===Sex.male} name="sex" onChange={()=>{
                       creationStateManager.updateEntityCreationParams({sex: Sex.male})
                   }}/>
                   <label className="form-check-label" htmlFor="maleRadioBtn">
                       Чоловіча
                   </label>
               </div>
               <div className="form-check">
                   <input className="form-check-input femaleRadioBtn" type="radio" checked={creationPersonParams.sex===Sex.female} name="sex" onChange={()=>{
                       creationStateManager.updateEntityCreationParams({sex: Sex.female})
                   }}/>
                   <label className="form-check-label" htmlFor="femaleRadioBtn">
                       Жіноча
                   </label>
               </div>
           </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Номер паспорта</Form.Label>
                <input value={passportData!.passportNumber} autoComplete={"new-password"} className={`passport-number form-control`} type="text" placeholder="Введіть номер паспорта"
                       onKeyDown={keyPressHandler}
                       onChange={e => {
                           creationStateManager.updateEntityCreationParams({middleName: e.currentTarget.value})
                        }
                       }
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Серія паспорта</Form.Label>
                <input  value={passportData!.passportSerial} autoComplete={"new-password"} className={`passport-serial form-control`} type="text" placeholder="Введіть серію паспорта"
                       onKeyDown={keyPressHandler}
                        onChange={e => {
                                dispatch(updatePassportData({passportSerial: e.currentTarget.value}))
                            }
                        }
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>РНОКПП</Form.Label>
                <input value={passportData!.rnokppCode} autoComplete={"new-password"} className={`rnokpp-code form-control`} type="text" placeholder="Введіть РНОКПП"
                       onKeyDown={inputBeforeDateContainerHandler}
                       onChange={e => {
                           dispatch(updatePassportData({rnokppCode: e.currentTarget.value}))
                        }
                       }
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item creation-input-group__item_long">
                <Form.Label>Дата народження</Form.Label>

                <InputDate date={new DateBuilder().setYear(year).setMonth(month).setDay(day).build()} setDate={setDate} className={"date-of-birth"}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item creation-input-group__item_long">
                <Form.Label>Адреса</Form.Label>
                <input type={"button"} className={"jur-person-creation__input address form-control"} value={creationPersonParams.location?creationPersonParams.location.address:"Додати адресу"}
                       onClick={()=>{
                           setModalSettings({mode: CreationModalModes.SET_GEOLOCATION})
                       }}
                />
            </Form.Group>

            <div className="create-relationships-section">
                <div className="create-relationships-section__heading-block">
                    <p className={"create-relationships-section__heading"}>Пов'язані особи</p>
                    <button className="create-relationships-section__add-person-btn"
                        onClick={event => {
                            event.preventDefault();
                            setModalSettings({mode: CreationModalModes.SET_RELATIONSHIP})
                        }}
                    >
                        <CrossIcon className={"create-relationships-section__add-person-icon"} color={"white"}/>
                    </button>
                </div>

                <div className={`create-relationships-section__relations ${relationships!.length>0?'':'empty'}`}>
                    {
                        relationships!.length>0?
                            <PersonRelationships relationships={creationPersonParams.relationships}/>
                            :
                            <p className={"m-0 placeholder-ltm"}>Немає зв'язків</p>
                    }
                </div>
            </div>

    </>
    )
}

export default CreatePerson;