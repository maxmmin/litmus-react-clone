import HumanCreationValidationService from "../HumanCreationValidationService";
import Person, {Relationship} from "../../../../../model/human/person/Person";
import {FieldValidationErrors, ValidationErrors} from "../../../../ValidationErrors";
import PassportData from "../../../../../model/human/person/PassportData";
import FullName from "../../../../exploration/FullName";

export type RelationShipValidationObject = ValidationErrors<{relationType: string, note: string}>&{relationship: Relationship}

export type PersonValidationObject = ValidationErrors<Pick<Person, keyof FullName | 'sex' | 'dateOfBirth'>>
    &ValidationErrors<{passportSerial: string, passportNumber: string, rnokppCode: string}>&{relationships: RelationShipValidationObject[]}

export type ServerPersonValidationObject = Omit<ValidationErrors<Person>, 'passportData'>&{
    'passportData.passportSerial'?: string,
    'passportData.passportNumber'?: string,
    'passportData.rnokppCode'?: string
}

export default interface PersonCreationValidationService extends HumanCreationValidationService<Person, PersonValidationObject, ServerPersonValidationObject> {
    validateRelationship(relationship: Relationship): RelationShipValidationObject;
    validateRelationships(relationShips: Relationship[]): RelationShipValidationObject[];
    validatePassportData(passportData: Person["passportData"]): Pick<PersonValidationObject, keyof PassportData>;
    validateSex(sex: Person["sex"]): PersonValidationObject["sex"];
    validateDateOfBirth(dateOfBirth: Person["dateOfBirth"]): PersonValidationObject["dateOfBirth"];
}