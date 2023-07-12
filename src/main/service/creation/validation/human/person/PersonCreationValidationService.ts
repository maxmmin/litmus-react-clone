import HumanCreationValidationService from "../HumanCreationValidationService";
import Person from "../../../../../model/human/person/Person";
import {ValidationErrors} from "../../../../ValidationErrors";

export type PersonValidationObject = Omit<Person, "passportData">&{passportSerial: string, passportNumber: string, rnokppCode: string}

export type ServerPersonValidationObject = Omit<ValidationErrors<Person>, 'passportData'>&{
    'passportData.passportSerial': string,
    'passportData.passportNumber': string,
    'passportData.rnokppCode': string
}

export default interface PersonCreationValidationService extends HumanCreationValidationService<Person, PersonValidationObject, ServerPersonValidationObject> {
    validatePassportData(model: Person): ValidationErrors<PersonValidationObject>;
}