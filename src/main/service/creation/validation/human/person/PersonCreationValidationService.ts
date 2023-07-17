import HumanCreationValidationService from "../HumanCreationValidationService";
import Person, {Relationship} from "../../../../../model/human/person/Person";
import {ValidationErrors} from "../../../../ValidationErrors";

export type RelationShipValidationObject = {relationType: string, note: string, relationship: Relationship}

export type PersonValidationObject = Omit<ValidationErrors<Person>, "passportData"|"relationships">&{passportSerial?: string, passportNumber?: string, rnokppCode?: string, relationships: RelationShipValidationObject[]}

export type ServerPersonValidationObject = Omit<ValidationErrors<Person>, 'passportData'>&{
    'passportData.passportSerial'?: string,
    'passportData.passportNumber'?: string,
    'passportData.rnokppCode'?: string
}

export default interface PersonCreationValidationService extends HumanCreationValidationService<Person, PersonValidationObject, ServerPersonValidationObject> {
    validatePassportData(model: Person): Partial<PersonValidationObject>;
    validateSex(model: Person): Partial<PersonValidationObject>;
    validateDateOfBirth(model: Person): Partial<PersonValidationObject>
}