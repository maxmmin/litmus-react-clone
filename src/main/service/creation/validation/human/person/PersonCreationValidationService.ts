import HumanCreationValidationService from "../HumanCreationValidationService";
import Person from "../../../../../model/human/person/Person";
import {ValidationErrors} from "../../../../ValidationErrors";

export type PersonValidationObject = Omit<Person, "passportData">&{passportSerial: string, passportNumber: string, rnokppCode: string}

export default interface PersonCreationValidationService extends HumanCreationValidationService<Person, PersonValidationObject> {
    validatePassportData(model: Person): ValidationErrors<PersonValidationObject>;
}