import Form from "react-bootstrap/Form";
import {
    inputBeforeDateContainerHandler,
    inputGroupsKeyPressHandler as keyPressHandler
} from "../../../util/pureFunctions";
import React, {useContext, useState} from "react";
import {useAppSelector} from "../../../redux/hooks";
import InputDate from "../../sharedComponents/InputDate";
import {CreationModalSettings} from "../CreationScreen";
import CreationGeoModal from "../geo/CreationGeoModal";
import {DateEntityTool} from "../../../model/DateEntity";
import Sex from "../../../model/human/person/Sex";
import {CrossIcon} from "../../../util/icons";
import ApplyPersonModal from "../ApplyPersonModal";
import {CreationModalModes} from "../../../redux/types/creation/CreationModalModes";
import PersonRelationships from "./PersonRelationships";
import {Entity} from "../../../model/Entity";
import PersonCreationStateManager from "../../../service/creation/stateManager/person/PersonCreationStateManager";
import InputError from "../../sharedComponents/InputError";
import {LitmusServiceContext} from "../../App";
import FilesUploader from "../../sharedComponents/FilesUploader";
import ImagesManager from "../../sharedComponents/ImagesManager";


const CreatePerson = () => {
    const [modalSettings, setModalSettings] = useState<CreationModalSettings>(null);

    const creationStateManager: PersonCreationStateManager = useContext(LitmusServiceContext).creation.stateManagers.person;

    const creationPersonParams = useAppSelector(state => state.creation?.person?.emergingEntity)

    const validationErrors = useAppSelector(state => state.creation.person?.validationErrors)!

    const litmusContext = useContext(LitmusServiceContext);

    const validationService = litmusContext.creation.validation.person;

    const fileService = litmusContext.files.fileService;

    const person = useAppSelector(state => state.creation.person?.emergingEntity)!

    const checkSexValidationError = () => {
        if (validationErrors?.sex) {
            creationStateManager.updateValidationErrors({sex: undefined})
        }
    }

    if (!creationPersonParams) {
        throw new Error("createPersonDto was null but it shouldn't be")
    }

    const {firstName, middleName, lastName} = creationPersonParams;

    const {year, month, day} = creationPersonParams!.dateOfBirth||{day: "", month: "", year: ""};

    const passportData = creationPersonParams?.passportData;

    const relationships = creationPersonParams?.relationships;

    const closeModal = () => setModalSettings(null)

    return (
        <>
            <CreationGeoModal entity={Entity.PERSON} show={modalSettings?.mode===CreationModalModes.SET_GEOLOCATION} close={closeModal}/>

            <ApplyPersonModal modalSettings={modalSettings} close={closeModal}/>

            <Form.Group className="mb-3 creation-input-group__item">
                    <Form.Label>Прізвище</Form.Label>
                    <input value={lastName?lastName:""} autoComplete={"new-password"} className={`lastName form-control ${validationErrors?.lastName?'is-invalid':''}`} type="text" placeholder="Введіть прізвище"
                           onKeyDown={keyPressHandler}
                           onChange={e => {
                                creationStateManager.updateEntityCreationParams({lastName: e.currentTarget.value})
                                if (validationErrors?.lastName&&!validationService.validateFullName(person)?.lastName) {
                                    creationStateManager.updateValidationErrors({lastName: undefined})
                                }
                            }
                        }
                    />
                <InputError error={validationErrors?.lastName}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Ім'я</Form.Label>
                <input value={firstName?firstName:""} autoComplete={"new-password"} className={`firstName form-control ${validationErrors?.firstName?'is-invalid':''}`} type="text" placeholder="Введіть ім'я"
                    onKeyDown={keyPressHandler}
                       onChange={e => {
                           creationStateManager.updateEntityCreationParams({firstName: e.currentTarget.value})
                           if (validationErrors?.firstName&&!validationService.validateFullName(person)?.firstName) {
                               creationStateManager.updateValidationErrors({firstName: undefined})
                           }
                        }
                       }
                />
                <InputError error={validationErrors?.firstName}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Ім'я по-батькові</Form.Label>
                <input value={middleName?middleName:""} autoComplete={"new-password"} className={`middleName form-control ${validationErrors?.middleName?'is-invalid':''}`} type="text" placeholder="Введіть ім'я по-батькові"
                    onKeyDown={keyPressHandler}
                       onChange={e => {
                           creationStateManager.updateEntityCreationParams({middleName: e.currentTarget.value});
                           if (validationErrors?.middleName&&!validationService.validateFullName(person)?.middleName) {
                               creationStateManager.updateValidationErrors({middleName: undefined})
                           }
                        }
                       }
                />
                <InputError error={validationErrors?.middleName}/>
            </Form.Group>

           <Form.Group className="mb-3 creation-input-group__item">
               <p className="m-0">Стать</p>

               <div className="form-check">
                   <input className="form-check-input maleRadioBtn" type="radio" checked={creationPersonParams.sex===Sex.male} name="sex" onChange={()=>{
                       creationStateManager.updateEntityCreationParams({sex: Sex.male})
                       checkSexValidationError();
                   }}/>
                   <label className="form-check-label" htmlFor="maleRadioBtn">
                       Чоловіча
                   </label>
               </div>
               <div className="form-check">
                   <input className="form-check-input femaleRadioBtn" type="radio" checked={creationPersonParams.sex===Sex.female} name="sex" onChange={()=>{
                       creationStateManager.updateEntityCreationParams({sex: Sex.female});
                       checkSexValidationError();
                   }}/>
                   <label className="form-check-label" htmlFor="femaleRadioBtn">
                       Жіноча
                   </label>
               </div>
               <InputError error={validationErrors?.sex}/>
           </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Номер паспорта</Form.Label>
                <input value={passportData!.passportNumber!} autoComplete={"new-password"} className={`passport-number form-control ${validationErrors?.passportNumber?'is-invalid':''}`} type="text" placeholder="Введіть номер паспорта"
                       onKeyDown={keyPressHandler}
                       onChange={e => {
                           creationStateManager.updatePassportData({passportNumber: e.currentTarget.value});
                           if (validationErrors?.passportNumber&&!validationService.validatePassportData(person).passportNumber) {
                               creationStateManager.updateValidationErrors({passportNumber: undefined})
                           }
                        }
                       }
                />
                <InputError error={validationErrors?.passportNumber}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Серія паспорта</Form.Label>
                <input  value={passportData!.passportSerial!} autoComplete={"new-password"} className={`passport-serial form-control ${validationErrors?.passportSerial?'is-invalid':''}`} type="text" placeholder="Введіть серію паспорта"
                       onKeyDown={keyPressHandler}
                        onChange={e => {
                                creationStateManager.updatePassportData({passportSerial: e.currentTarget.value});
                            if (validationErrors?.passportSerial&&!validationService.validatePassportData(person).passportSerial) {
                                creationStateManager.updateValidationErrors({passportSerial: undefined})
                            }
                            }
                        }
                />
                <InputError error={validationErrors?.passportSerial}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>РНОКПП</Form.Label>
                <input value={passportData!.rnokppCode!} autoComplete={"new-password"} className={`rnokpp-code form-control ${validationErrors?.rnokppCode?'is-invalid':''}`} type="text" placeholder="Введіть РНОКПП"
                       onKeyDown={inputBeforeDateContainerHandler}
                       onChange={e => {
                           creationStateManager.updatePassportData({rnokppCode: e.currentTarget.value})
                           if (validationErrors?.rnokppCode&&!validationService.validatePassportData(person).rnokppCode) {
                               creationStateManager.updateValidationErrors({rnokppCode: undefined})
                           }
                        }
                       }
                />
                <InputError error={validationErrors?.rnokppCode}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item creation-input-group__item_long">
                <Form.Label>Дата народження</Form.Label>

                <InputDate inputPrefix={validationErrors?.dateOfBirth?"is-invalid":undefined} date={new DateEntityTool().setYear(year).setMonth(month).setDay(day).build()} setDate={date => creationStateManager.updateEntityCreationParams({dateOfBirth: date})} className={"date-of-birth"}/>
                <InputError error={validationErrors?.dateOfBirth}/>
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

            <Form.Group className="mb-3 creation-input-group__item creation-input-group__item_long">
                <Form.Label>Зображення особи</Form.Label>
                <ImagesManager mainImage={} images={} uploadImage={file=>{
                    const fileKey = fileService.saveFile(file);

                }} removeImage={()=>true}/>
            </Form.Group>

    </>
    )
}

export default CreatePerson;