import HumanCreationValidationService from "../HumanCreationValidationService";
import {ValidationErrors} from "../../../../model/ValidationErrors";
import PassportData from "../../../../model/human/person/PassportData";
import {PersonCreationParams, RelationshipCreationParams} from "../../../coreServices/creation/PersonCreationService";
import {ImageValidationObject} from "../../validationModels/ImageValidationObject";
import SourceValidationObject from "../../validationModels/SourceValidationObject";

export type RelationShipValidationObject = ValidationErrors<{type: string, note: string}>&{relationship: RelationshipCreationParams}

export const getRelationshipDefaultValidationObject = (relShip: RelationshipCreationParams): RelationShipValidationObject => ({relationship: relShip, type: null, note: null})

export type PersonValidationObject = ValidationErrors<Omit<PersonCreationParams, 'relationships'|'passportData'|'media'|'sources'>>
    &ValidationErrors<{passportSerial: string, passportNumber: string, rnokppCode: string}>
    &   {
        relationships: RelationShipValidationObject[],
        images: ImageValidationObject[],
        sources: SourceValidationObject[]
    }

export const personDefaultValidationObject: PersonValidationObject = Object.freeze({
    firstName: null,
    middleName: null,
    lastName: null,
    rnokppCode: null,
    dateOfBirth: null,
    sex: null,
    location: null,
    passportSerial: null,
    passportNumber: null,
    relationships: [],
    images: [],
    sources: []
})

export type ServerPersonValidationObject = Omit<ValidationErrors<PersonCreationParams>, 'passportData'|'relationships'>&{
    'passportData.passportSerial'?: string,
    'passportData.passportNumber'?: string,
    'passportData.rnokppCode'?: string,
    'media.mainImg'?: string
}&Record<string, string>

export default interface PersonCreationValidationService extends HumanCreationValidationService<PersonCreationParams, PersonValidationObject, ServerPersonValidationObject> {
    validateRelationship(relationship: RelationshipCreationParams): RelationShipValidationObject;
    hasRelationshipVdObjectErrors(validationObject: RelationShipValidationObject): boolean;
    validateRelationships(relationShips: RelationshipCreationParams[]): RelationShipValidationObject[];
    validatePassportData(passportData: PersonCreationParams["passportData"]): Pick<PersonValidationObject, keyof PassportData>;
    validateSex(sex: PersonCreationParams["sex"]): PersonValidationObject["sex"];
    validateDateOfBirth(dateOfBirth: PersonCreationParams["dateOfBirth"]): PersonValidationObject["dateOfBirth"];
}