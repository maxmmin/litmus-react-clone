import ValidationService from "../../../ValidationService";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import {ValidationErrors} from "../../../ValidationErrors";

export type JurPersonValidationObject = ValidationErrors<Pick<JurPerson, 'name'|'dateOfRegistration'|'edrpou'>>

export const jurPersonDefaultValidationObject: JurPersonValidationObject = Object.freeze({
    name: null,
    dateOfRegistration: null,
    edrpou: null
})

export type ServerJurPersonValidationObject = Partial<ValidationErrors<JurPerson>>

export default interface JurPersonCreationValidationService extends ValidationService<JurPerson, JurPersonValidationObject, ServerJurPersonValidationObject> {

}