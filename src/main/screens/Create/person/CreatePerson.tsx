import Form from "react-bootstrap/Form";
import {
    inputBeforeDateContainerHandler,
    inputGroupsKeyPressHandler as keyPressHandler
} from "../../../data/pureFunctions";
import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {
    updatePassportData,
    updatePersonCreationParams,
    updatePersonSex
} from "../../../redux/actions/CreationParamsActions";
import InputDate from "../../components/InputDate";
import {CreationModalSettings} from "../Create";
import CreationGeoModal from "../geo/CreationGeoModal";
import {Tables} from "../../../types/explorationParams";
import DateEntity, {DateBuilder} from "../../../types/DateEntity";
import Sex from "../../../types/Sex";
import {AddIcon} from "../../../data/icons";
import ApplyPersonModal from "../ApplyPersonModal";
import {CreationModalModes} from "../../../types/CreationModalModes";

const CreatePerson = () => {
    const [modalSettings, setModalSettings] = useState<CreationModalSettings>(null);

    const createPersonDto = useAppSelector(state => state.creationParams?.personCreationData)

    const dispatch = useAppDispatch();

    const {year, month, day} = createPersonDto!.dateOfBirth;

    const passportData = createPersonDto?.passportData;

    if (!createPersonDto) {
        throw new Error("createPersonDto was null but it shouldn't be")
    }

    const setDate = (date: DateEntity) => {
        dispatch(updatePersonCreationParams({dateOfBirth: date}))
    }

    const closeModal = () => setModalSettings(null)

    return (
        <>
            <CreationGeoModal table={Tables.PERSONS} show={modalSettings?.mode===CreationModalModes.SET_GEOLOCATION} close={closeModal}/>

            <ApplyPersonModal modalSettings={modalSettings} close={closeModal}/>

            <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>Прізвище</Form.Label>
                    <input value={createPersonDto.lastName} autoComplete={"new-password"} className={`lastName form-control`}  type="text" placeholder="Введіть прізвище"
                        onKeyDown={keyPressHandler}
                        onChange={e => {
                            dispatch(updatePersonCreationParams({lastName: e.currentTarget.value}))
                            }
                        }
                    />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Ім'я</Form.Label>
                <input value={createPersonDto.firstName} autoComplete={"new-password"} className={`firstName form-control`} type="text" placeholder="Введіть ім'я"
                    onKeyDown={keyPressHandler}
                       onChange={e => {
                            dispatch(updatePersonCreationParams({firstName: e.currentTarget.value}))
                        }
                       }
                    />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Ім'я по-батькові</Form.Label>
                <input value={createPersonDto.middleName} autoComplete={"new-password"} className={`middleName form-control`} type="text" placeholder="Введіть ім'я по-батькові"
                    onKeyDown={keyPressHandler}
                       onChange={e => {
                           dispatch(updatePersonCreationParams({middleName: e.currentTarget.value}))
                        }
                       }
                />
            </Form.Group>

           <Form.Group className="mb-3 creation-input-group__item">
               <p className="m-0">Стать</p>

               <div className="form-check">
                   <input className="form-check-input maleRadioBtn" type="radio" checked={createPersonDto.sex===Sex.male} name="sex" onChange={()=>{
                        dispatch(updatePersonSex(Sex.male))
                   }}/>
                   <label className="form-check-label" htmlFor="maleRadioBtn">
                       Чоловіча
                   </label>
               </div>
               <div className="form-check">
                   <input className="form-check-input femaleRadioBtn" type="radio" checked={createPersonDto.sex===Sex.female} name="sex" onChange={()=>{
                       dispatch(updatePersonSex(Sex.female))
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
                           dispatch(updatePassportData({passportNumber: e.currentTarget.value}))
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
                <input type={"button"} className={"jur-person-creation__input address form-control"} value={createPersonDto.location?createPersonDto.location.address:"Додати адресу"}
                       onClick={()=>{
                           setModalSettings({mode: CreationModalModes.SET_GEOLOCATION})
                       }}
                />
            </Form.Group>

            <div className="relationships-container">
                <div className="relationships-container__heading-block">
                    <p className={"relationships-container__heading"}>Пов'язані особи</p>
                    <button className="relationships-container__add-person-btn"
                        onClick={event => {
                            event.preventDefault();
                            setModalSettings({mode: CreationModalModes.SET_RELATIONSHIP})
                        }}
                    >
                        <AddIcon className={"add-person-icon"} color={"white"}/>
                    </button>
                </div>

                <div className="relationships-container__relations">
                    <p className={"m-0 placeholder-ltm"}>Немає зв'язків</p>
                </div>
            </div>

    </>
    )
}

export default CreatePerson;