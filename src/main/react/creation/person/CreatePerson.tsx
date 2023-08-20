import Form from "react-bootstrap/Form";
import {
    inputBeforeDateContainerHandler,
    inputGroupsKeyPressHandler as keyPressHandler
} from "../../../util/pureFunctions";
import React, {useContext, useEffect, useMemo, useState} from "react";
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
import FileProps from "../../../model/FileProps";
import SimpleImagesManager from "../../sharedComponents/SimpleImagesManager";

type PersonImages = {
    mainImage: FileProps|null,
    images: FileProps[]
}

const CreatePerson = () => {
    const [modalSettings, setModalSettings] = useState<CreationModalSettings>(null);

    const creationStateManager: PersonCreationStateManager = useContext(LitmusServiceContext).creation.stateManagers.person;

    const creationPersonParams = useAppSelector(state => state.creation?.person?.emergingEntity)

    const validationErrors = useAppSelector(state => state.creation.person?.validationErrors)!

    const litmusContext = useContext(LitmusServiceContext);

    const validationService = litmusContext.creation.validation.person;

    const fileService = litmusContext.files.fileService;

    const person = useAppSelector(state => state.creation.person?.emergingEntity)!


    if (!creationPersonParams) {
        throw new Error("createPersonDto was null but it shouldn't be")
    }

    const {firstName, middleName, lastName} = creationPersonParams;

    const {year, month, day} = creationPersonParams!.dateOfBirth||{day: "", month: "", year: ""};

    const passportData = creationPersonParams?.passportData;

    const relationships = creationPersonParams?.relationships;

    const {mainImage, images} = useMemo<PersonImages>(()=>{
        const media = creationPersonParams.media;
        return {
            mainImage: media.mainImage?{file: fileService.getFileOrThrow(media.mainImage), fileKey: media.mainImage}:null,
            images: media.images.map(fileKey=>({file: fileService.getFileOrThrow(fileKey), fileKey: fileKey}))
        }
    }, [creationPersonParams.media])

    const closeModal = () => setModalSettings(null)

    useEffect(()=>{
        const updatedPassportDataValidation = validationService.validatePassportData(person.passportData);


        if (validationErrors?.passportNumber&&!updatedPassportDataValidation.passportNumber) {
            creationStateManager.updateValidationErrors({passportNumber: null})
        }

        if (validationErrors?.passportSerial&&!updatedPassportDataValidation.passportSerial) {
            creationStateManager.updateValidationErrors({passportSerial: null})
        }

        if (validationErrors?.rnokppCode&&!updatedPassportDataValidation.rnokppCode) {
            creationStateManager.updateValidationErrors({rnokppCode: null})
        }
    }, [passportData])

    useEffect(()=>{
        const updatedFullNameErrors = validationService.validateFullName(person);

        if (validationErrors?.lastName&&!updatedFullNameErrors.lastName) {
            creationStateManager.updateValidationErrors({lastName: null})
        }

        if (validationErrors?.middleName&&!updatedFullNameErrors?.middleName) {
            creationStateManager.updateValidationErrors({middleName: null})
        }

        if (validationErrors?.firstName&&!updatedFullNameErrors.firstName) {
            creationStateManager.updateValidationErrors({firstName: null})
        }
    }, [person.firstName, person.middleName, person.lastName])

    useEffect(()=>{
        if (validationErrors?.sex&&!validationService.validateSex(person.sex)) {
            creationStateManager.updateValidationErrors({sex: null})
        }
    }, [person.sex])

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
                   }}/>
                   <label className="form-check-label" htmlFor="maleRadioBtn">
                       Чоловіча
                   </label>
               </div>
               <div className="form-check">
                   <input className="form-check-input femaleRadioBtn" type="radio" checked={creationPersonParams.sex===Sex.female} name="sex" onChange={()=>{
                       creationStateManager.updateEntityCreationParams({sex: Sex.female});
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

            <div className="mb-3 create-relationships-section">
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
                <SimpleImagesManager
                    mainImageKey={mainImage?mainImage.fileKey:null}
                    images={images}
                    imageStateManager={creationStateManager}
                    cssAnchor={"creation"}
                />
            </Form.Group>

    </>
    )
}

export default CreatePerson;