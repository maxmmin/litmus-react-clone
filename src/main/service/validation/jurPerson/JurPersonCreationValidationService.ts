import ValidationService from "../ValidationService";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import {ValidationErrors} from "../../../model/ValidationErrors";
import {JurPersonCreationParams} from "../../../redux/types/creation/JurPersonCreationState";

export type JurPersonValidationObject = ValidationErrors<Pick<JurPersonCreationParams, 'name'|'dateOfRegistration'|'edrpou'>>

export const jurPersonDefaultValidationObject: JurPersonValidationObject = Object.freeze({
    name: null,
    dateOfRegistration: null,
    edrpou: null
})

export type ServerJurPersonValidationObject = Partial<ValidationErrors<JurPersonCreationParams>>

export default interface JurPersonCreationValidationService extends ValidationService<JurPersonCreationParams, JurPersonValidationObject, ServerJurPersonValidationObject> {
    validateDateOfRegistration(dateOfRegistration: JurPersonCreationParams["dateOfRegistration"]): string|null;
    validateName(name: JurPersonCreationParams["name"]): string|null;
    validateEdrpou(edrpou: JurPersonCreationParams["edrpou"]): string|null
}