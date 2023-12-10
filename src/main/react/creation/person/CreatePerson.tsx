import Form from "react-bootstrap/Form";
import {
    checkNotEmpty,
    inputBeforeDateContainerHandler,
    inputGroupsKeyPressHandler as keyPressHandler
} from "../../../util/pureFunctions";
import React, {useContext, useEffect, useLayoutEffect, useMemo, useState} from "react";
import {useAppSelector} from "../../../redux/hooks";
import InputDate from "../../sharedComponents/InputDate";
import {CreationModalSettings} from "../CreationScreen";
import CreationGeoModal from "../geo/CreationGeoModal";
import {DateEntityTool} from "../../../model/DateEntity";
import Sex from "../../../model/human/person/Sex";
import {CrossIcon} from "../../assets/icons";
import ApplyPersonModal from "../ApplyPersonModal";
import {CreationModalModes} from "../../../redux/types/creation/CreationModalModes";
import PersonRelationshipsCreation from "./PersonRelationshipsCreation";
import {Entity} from "../../../model/Entity";
import PersonCreationStateManager from "../../../service/stateManagers/creation/person/PersonCreationStateManager";
import InputError from "../../sharedComponents/InputError";
import {LitmusServiceContext} from "../../App";
import SimpleImagesManager from "../../sharedComponents/SimpleImagesManager";
import {Images} from "../../../model/Media";

const CreatePerson = () => {
    const [modalSettings, setModalSettings] = useState<CreationModalSettings>(null);

    const creationStateManager: PersonCreationStateManager = useContext(LitmusServiceContext).creation.stateManagers.person;

    const validationErrors = useAppSelector(state => state.creation.person?.validationErrors)

    const litmusContext = useContext(LitmusServiceContext);

    const validationService = litmusContext.creation.validation.person;

    const fileService = litmusContext.files.fileRepo;

    const person = useAppSelector(state => state.creation.person?.emergingEntity)!

    if (!person) {
        throw new Error("createPersonDto was null but it shouldn't be")
    }

    const {firstName, middleName, lastName} = person;

    const {year, month, day} = person!.dateOfBirth||{day: "", month: "", year: ""};

    const passportData = person?.passportData;

    const relationships = person?.relationships;

    const {mainImage, images} = useMemo<Images>(()=>{
        const media = person.media;
        return {
            mainImage: media.mainImage?{
                file: fileService.getFileOrThrow(media.mainImage),
                error: (validationErrors?.images.find(i => i.imageKey === media.mainImage))?.message,
                fileKey: media.mainImage
            }:null,
            images: media.images.map(fileKey=>(
                {
                    file: fileService.getFileOrThrow(fileKey), fileKey: fileKey,
                    error: (validationErrors?.images.find(i => i.imageKey === fileKey))?.message
                }
            ))
        }
    }, [person.media])


    useEffect(()=>{
        if (validationErrors?.images) {
            validationErrors.images.forEach(imageValObj => {
                if (
                        imageValObj.imageKey !== mainImage?.fileKey
                        &&
                        (images.findIndex(img => img.fileKey === imageValObj.imageKey) === -1)
                    ) {
                    const newImgErrors = validationErrors.images.filter(i => i !== imageValObj)
                    creationStateManager.updateValidationErrors({images: newImgErrors})
                }
            })
        }
    }, [person.media, validationErrors?.images])

    const closeModal = () => setModalSettings(null)

    function clearValidityErrsOnSexSelect () {
        if (validationErrors?.sex&&!validationService.validateSex(creationStateManager.getCreationParams().sex)) {
            creationStateManager.updateValidationErrors({sex: null})
        }
    }

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

                               const updatedFullNameErrors = validationService.validateFullName(creationStateManager.getCreationParams());

                               if (validationErrors?.lastName) {
                                   if (!updatedFullNameErrors.lastName) {
                                       creationStateManager.updateValidationErrors({lastName: null});
                                   } else if (updatedFullNameErrors.lastName !== validationErrors.lastName) creationStateManager.updateValidationErrors({lastName: updatedFullNameErrors.lastName});
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

                           const updatedFullNameErrors = validationService.validateFullName(creationStateManager.getCreationParams());

                           if (validationErrors?.firstName) {
                               if (!updatedFullNameErrors.firstName) {
                                   creationStateManager.updateValidationErrors({firstName: null});
                               } else if (updatedFullNameErrors.firstName !== validationErrors.firstName) creationStateManager.updateValidationErrors({firstName: updatedFullNameErrors.firstName})
                           }
                       }}
                />
                <InputError error={validationErrors?.firstName}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item">
                <Form.Label>Ім'я по-батькові</Form.Label>
                <input value={middleName?middleName:""} autoComplete={"new-password"} className={`middleName form-control ${validationErrors?.middleName?'is-invalid':''}`} type="text" placeholder="Введіть ім'я по-батькові"
                    onKeyDown={keyPressHandler}
                       onChange={e => {
                           creationStateManager.updateEntityCreationParams({middleName: e.currentTarget.value});

                           const updatedFullNameErrors = validationService.validateFullName(creationStateManager.getCreationParams());

                           if (validationErrors?.middleName) {
                               if (!updatedFullNameErrors?.middleName) {
                                   creationStateManager.updateValidationErrors({middleName: null});
                               } else if (updatedFullNameErrors?.middleName !== validationErrors.middleName) creationStateManager.updateValidationErrors({middleName: updatedFullNameErrors.middleName});
                           }
                        }
                       }
                />
                <InputError error={validationErrors?.middleName}/>
            </Form.Group>

           <Form.Group className="mb-3 creation-input-group__item">
               <p className="m-0">Стать</p>

               <div className="form-check">
                   <input className="form-check-input maleRadioBtn" type="radio" checked={person.sex===Sex.MALE} name="sex" onChange={()=>{
                       creationStateManager.updateEntityCreationParams({sex: Sex.MALE})
                       clearValidityErrsOnSexSelect()
                   }}/>
                   <label className="form-check-label" htmlFor="maleRadioBtn">
                       Чоловіча
                   </label>
               </div>
               <div className="form-check">
                   <input className="form-check-input femaleRadioBtn" type="radio" checked={person.sex===Sex.FEMALE} name="sex" onChange={()=>{
                       creationStateManager.updateEntityCreationParams({sex: Sex.FEMALE});
                       clearValidityErrsOnSexSelect()
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
                           const updatedPassportDataValidation = validationService.validatePassportData(creationStateManager.getCreationParams().passportData);

                           if (validationErrors?.passportNumber) {
                               if (!updatedPassportDataValidation.passportNumber) {
                                   creationStateManager.updateValidationErrors({passportNumber: null});
                               } else if (updatedPassportDataValidation.passportNumber !== validationErrors.passportNumber) {
                                   creationStateManager.updateValidationErrors({passportNumber: updatedPassportDataValidation.passportNumber})
                               }
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

                                const updatedPassportDataValidation = validationService.validatePassportData(creationStateManager.getCreationParams().passportData);

                                if (validationErrors?.passportSerial) {
                                    if (!updatedPassportDataValidation.passportSerial) {
                                        creationStateManager.updateValidationErrors({passportSerial: null});
                                    } else if (updatedPassportDataValidation.passportSerial !== validationErrors.passportSerial)
                                        creationStateManager.updateValidationErrors({passportSerial: updatedPassportDataValidation.passportSerial});
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

                           const updatedPassportDataValidation = validationService.validatePassportData(creationStateManager.getCreationParams().passportData);

                           if (validationErrors?.rnokppCode) {
                               if (!updatedPassportDataValidation.rnokppCode) {
                                   creationStateManager.updateValidationErrors({rnokppCode: null})
                               } else if (updatedPassportDataValidation.rnokppCode !== validationErrors.rnokppCode) creationStateManager.updateValidationErrors({rnokppCode: null});
                           }
                       }}
                />
                <InputError error={validationErrors?.rnokppCode}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item creation-input-group__item_long">
                <Form.Label>Дата народження</Form.Label>

                <InputDate inputPrefix={validationErrors?.dateOfBirth?"is-invalid":undefined} date={new DateEntityTool().setYear(year).setMonth(month).setDay(day).build()}
                           setDate={date => {
                               creationStateManager.updateEntityCreationParams({dateOfBirth: date})

                               if (validationErrors?.dateOfBirth) {
                                   const updatedDateValidationConstraint = validationService.validateDateOfBirth(creationStateManager.getCreationParams().dateOfBirth);
                                   if (!updatedDateValidationConstraint) creationStateManager.updateValidationErrors({dateOfBirth: null})
                                    else if (updatedDateValidationConstraint !== validationErrors.dateOfBirth) creationStateManager.updateValidationErrors({dateOfBirth: updatedDateValidationConstraint});
                               }
                           }}
                           className={"date-of-birth"}/>
                <InputError error={validationErrors?.dateOfBirth}/>
            </Form.Group>

            <Form.Group className="mb-3 creation-input-group__item creation-input-group__item_long">
                <Form.Label>Адреса</Form.Label>
                <input type={"button"} className={"jur-person-creation__input address form-control"} value={person.location?person.location.address:"Додати адресу"}
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
                            <PersonRelationshipsCreation relationships={person.relationships}/>
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