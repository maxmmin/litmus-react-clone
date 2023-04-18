import Form from "react-bootstrap/Form";
import {
    DateBuilder, inputBeforeDateContainerHandler,
    inputGroupsKeyPressHandler as keyPressHandler, preventEnter, switchNeighbourInput, switchNext
} from "../../../data/pureFunctions";
import React, {useMemo, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {updatePassportData, updatePersonCreationParams} from "../../../redux/actions/CreationParamsActions";
import InputDate from "../../components/InputDate";
import {DateEntity} from "../../../types/DateEntity";
import {CreationModalModes, CreationModalSettings} from "../Create";
import ApplyPersonModal from "../ApplyPersonModal";
import CreationGeoModal from "../geo/CreationGeoModal";
import {Tables} from "../../../types/explorationParams";

const CreatePerson = () => {
    const [modalSettings, setModalSettings] = useState<CreationModalSettings>(null);

    const createPersonDto = useAppSelector(state => state.creationParams?.personCreationData)

    const dispatch = useAppDispatch();

    const {year, month, day} = createPersonDto?.dateOfBirth!;

    const passportData = createPersonDto?.passportData;

    if (!createPersonDto) {
        throw new Error("createPersonDto was null but it shouldn't")
    }

    const setDate = (date: DateEntity) => {
        dispatch(updatePersonCreationParams({dateOfBirth: date}))
    }

    const closeModal = () => setModalSettings(null)

    return (
        <>
            <CreationGeoModal table={Tables.PERSONS} show={modalSettings?.mode===CreationModalModes.SET_GEOLOCATION} close={closeModal}/>

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
                <Form.Label>Номер паспорта</Form.Label>
                <input value={passportData?.passportNumber} autoComplete={"new-password"} className={`passport-number form-control`} type="text" placeholder="Введіть номер паспорта"
                       onKeyDown={keyPressHandler}
                       onChange={e => {
                           dispatch(updatePassportData({passportNumber: e.currentTarget.value}))
                        }
                       }
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Серія паспорта</Form.Label>
                <input  value={passportData?.passportSerial} autoComplete={"new-password"} className={`passport-serial form-control`} type="text" placeholder="Введіть серію паспорта"
                       onKeyDown={keyPressHandler}
                        onChange={e => {
                                dispatch(updatePassportData({passportSerial: e.currentTarget.value}))
                            }
                        }
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>РНОКПП</Form.Label>
                <input value={passportData?.rnokppCode} autoComplete={"new-password"} className={`rnokpp-code form-control`} type="text" placeholder="Введіть РНОКПП"
                       onKeyDown={inputBeforeDateContainerHandler}
                       onChange={e => {
                           dispatch(updatePassportData({rnokppCode: e.currentTarget.value}))
                        }
                       }
                />
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item creation-input-group__item_long">
                <Form.Label>Дата народження</Form.Label>

                <InputDate date={new DateBuilder().setYear(year).setMonth(month).setDay(day)} setDate={setDate} className={"date-of-birth"}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item creation-input-group__item_long">
                <Form.Label>Адреса</Form.Label>
                <input type={"button"} className={"jur-person-creation__input address form-control"} value={createPersonDto.location?createPersonDto.location.address:"Додати адресу"}
                       onClick={()=>{
                           setModalSettings({mode: CreationModalModes.SET_GEOLOCATION})
                       }}
                />
            </Form.Group>

    </>
    )
}

export default CreatePerson;