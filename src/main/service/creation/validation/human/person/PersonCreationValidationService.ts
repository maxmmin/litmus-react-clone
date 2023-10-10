import HumanCreationValidationService from "../HumanCreationValidationService";
import Person, {Relationship} from "../../../../../model/human/person/Person";
import {FieldValidationErrors, ValidationErrors} from "../../../../ValidationErrors";
import PassportData from "../../../../../model/human/person/PassportData";
import FullName from "../../../../exploration/FullName";
import {PersonCreationParams, RelationshipCreationParams} from "../../../PersonCreationService";

export type RelationShipValidationObject = ValidationErrors<{relationType: string, note: string}>&{relationship: RelationshipCreationParams}

export const getRelationshipDefaultValidationObject = (relShip: RelationshipCreationParams): RelationShipValidationObject => ({relationship: relShip, relationType: null, note: null})

export type PersonValidationObject = ValidationErrors<Pick<Person, keyof FullName | 'sex' | 'dateOfBirth'>>
    &ValidationErrors<{passportSerial: string, passportNumber: string, rnokppCode: string}>&{relationships: RelationShipValidationObject[]}

export const personDefaultValidationObject: PersonValidationObject = Object.freeze({
    firstName: null,
    middleName: null,
    lastName: null,
    rnokppCode: null,
    dateOfBirth: null,
    sex: null,
    passportSerial: null,
    passportNumber: null,
    relationships: []
})

export type ServerPersonValidationObject = Omit<ValidationErrors<Person>, 'passportData'>&{
    'passportData.passportSerial'?: string,
    'passportData.passportNumber'?: string,
    'passportData.rnokppCode'?: string
}

export default interface PersonCreationValidationService extends HumanCreationValidationService<PersonCreationParams, PersonValidationObject, ServerPersonValidationObject> {
    validateRelationship(relationship: RelationshipCreationParams): RelationShipValidationObject;
    validateRelationships(relationShips: RelationshipCreationParams[]): RelationShipValidationObject[];
    validatePassportData(passportData: PersonCreationParams["passportData"]): Pick<PersonValidationObject, keyof PassportData>;
    validateSex(sex: PersonCreationParams["sex"]): PersonValidationObject["sex"];
    validateDateOfBirth(dateOfBirth: PersonCreationParams["dateOfBirth"]): PersonValidationObject["dateOfBirth"];
}