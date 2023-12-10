import ValidationService from "../ValidationService";
import {ValidationErrors} from "../../../model/ValidationErrors";
import {JurPersonCreationParams} from "../../../redux/types/creation/JurPersonCreationState";
import {ImageValidationObject} from "../../../rest/dto/ImageValidationObject";
import {ServerMediaContainableValidationObject} from "../../../rest/dto/ServerMediaContainableValidationObject";

export type JurPersonValidationObject = ValidationErrors<Pick<JurPersonCreationParams, 'name'|'dateOfRegistration'|'edrpou'>> & {
    images: ImageValidationObject[]
}

export const jurPersonDefaultValidationObject: JurPersonValidationObject = Object.freeze({
    name: null,
    dateOfRegistration: null,
    edrpou: null,
    images: []
})

export type ServerJurPersonValidationObject = Partial<ValidationErrors<JurPersonCreationParams>> & ServerMediaContainableValidationObject

export default interface JurPersonCreationValidationService extends ValidationService<JurPersonCreationParams, JurPersonValidationObject, ServerJurPersonValidationObject> {
    validateDateOfRegistration(dateOfRegistration: JurPersonCreationParams["dateOfRegistration"]): string|null;
    validateName(name: JurPersonCreationParams["name"]): string|null;
    validateEdrpou(edrpou: JurPersonCreationParams["edrpou"]): string|null
}