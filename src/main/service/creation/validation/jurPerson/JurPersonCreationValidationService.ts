import ValidationService from "../../../ValidationService";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import {ValidationErrors} from "../../../ValidationErrors";

export type JurPersonValidationObject = ValidationErrors<JurPerson>

export type ServerJurPersonValidationObject = ValidationErrors<JurPerson>

export default interface JurPersonCreationValidationService extends ValidationService<JurPerson, JurPersonValidationObject, ServerJurPersonValidationObject> {

}