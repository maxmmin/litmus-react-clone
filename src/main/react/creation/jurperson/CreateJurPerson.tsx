import Form from "react-bootstrap/Form";
import {inputGroupsKeyPressHandler as keyPressHandler} from "../../../util/pureFunctions";
import React, {useContext, useEffect, useMemo, useState} from "react";
import ApplyPersonModal from "../ApplyPersonModal";
import {useAppSelector} from "../../../redux/hooks";
import CreationGeoModal from "../geo/CreationGeoModal";
import {CreationModalSettings} from "../CreationScreen";
import InputDate from "../../sharedComponents/InputDate";
import {DateEntityTool} from "../../../model/DateEntity";
import {CreationModalModes} from "../../../redux/types/creation/CreationModalModes";
import {Entity} from "../../../model/Entity";
import {LitmusServiceContext} from "../../App";
import InputError from "../../sharedComponents/InputError";
import Human from "../../../model/human/Human";
import getFullName from "../../../util/functional/getFullName";
import SimpleImagesManager from "../../sharedComponents/SimpleImagesManager";
import {Images} from "../../../model/Media";
import getBundledImages from "../../../util/functional/getBundledImages";


const getShortInfo = (person: Human&{id: number}): string => `${person.id}: ${getFullName(person)}`

const CreateJurPerson = () => {
    const [modalSettings, setModalSettings] = useState<CreationModalSettings>(null);

    const context = useContext(LitmusServiceContext);

    const creationStateManager = context.creation.stateManagers.jurPerson;

    const closeModal = () => setModalSettings(null)

    const jurPersonCreationParams = useAppSelector(state => state.creation?.jurPerson?.emergingEntity)

    const validationErrors = useAppSelector(state => state.creation.jurPerson?.validationErrors);

    const validationService = context.creation.validation.jurPerson;

    const fileRepo = context.files.fileRepo;

    if (!jurPersonCreationParams) {
        throw new Error("createPersonDto was null but it shouldn't")
    }

    const {mainImage, images} = useMemo<Images>(()=>
            getBundledImages(jurPersonCreationParams.media, fileRepo, validationErrors?.images),
        [jurPersonCreationParams.media])

    useEffect(()=>{
        if (validationErrors?.images) {
            const newImgErrors = validationErrors
                .images.filter(i => i.fileKey === mainImage?.fileKey || images.findIndex(img => img.fileKey === i.fileKey) > -1 );

            if (validationErrors.images.length !== newImgErrors.length) creationStateManager.updateValidationErrors({images: newImgErrors})
        }
    }, [jurPersonCreationParams.media, validationErrors?.images])

    const {year, month, day} = jurPersonCreationParams.dateOfRegistration||{year: '', month: '', day: ''};

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

                               if (validationErrors?.name) {
                                   const updatedNameErr = validationService.validateName(creationStateManager.getCreationParams().name);
                                   if (!updatedNameErr) {
                                       creationStateManager.updateValidationErrors({name: null})
                                   } else if (updatedNameErr !== validationErrors.name) creationStateManager.updateValidationErrors({name: updatedNameErr})
                               }
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

                               if (validationErrors?.edrpou) {
                                   const updatedEdrpouErr = validationService.validateEdrpou(creationStateManager.getCreationParams().edrpou);
                                   if (!updatedEdrpouErr) {
                                       creationStateManager.updateValidationErrors({edrpou: null})
                                   } else if (updatedEdrpouErr !== validationErrors.edrpou) creationStateManager.updateValidationErrors({edrpou: updatedEdrpouErr})
                               }
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

                    <InputDate inputPrefix={validationErrors?.dateOfRegistration?'is-invalid':''}
                               date={new DateEntityTool().setDay(day).setMonth(month).setYear(year).build()}
                               setDate={date=>{
                                   creationStateManager.updateEntityCreationParams({dateOfRegistration: date})

                                   if (validationErrors?.dateOfRegistration) {
                                       const updatedDateOfRegistrationErr = validationService.validateDateOfRegistration(creationStateManager.getCreationParams().dateOfRegistration);
                                       if (!updatedDateOfRegistrationErr) {
                                           creationStateManager.updateValidationErrors({dateOfRegistration: null})
                                       } else if (updatedDateOfRegistrationErr !== validationErrors.dateOfRegistration) creationStateManager.updateValidationErrors({dateOfRegistration: updatedDateOfRegistrationErr})
                                   }
                               }}
                               className={"date-of-registration"}

                    />

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

            <Form.Group className="mb-3 creation-input-group__item creation-input-group__item_long">
                <Form.Label>Прикріпити зображення</Form.Label>
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

export default CreateJurPerson;