import EntityCreationState, {BasicEntityCreationState} from "./EntityCreationState";
import Person, {RelationshipsScanOptions} from "../../../model/human/person/Person";
import {DateEntityTool} from "../../../model/DateEntity";
import {
    personDefaultValidationObject,
    PersonValidationObject
} from "../../../service/creation/validation/human/person/PersonCreationValidationService";
import {PersonCreationParams} from "../../../service/creation/PersonCreationService";

export type NoRelationshipsPerson = Omit<Person, 'relationshipsInfo'|'nestedRelationshipsInfo'>

export default interface PersonCreationState extends EntityCreationState<PersonCreationParams, PersonValidationObject>{}

export const defaultScanOptions: RelationshipsScanOptions = {depth: 0}

export const initialPersonCreationParams: PersonCreationParams = {
    media: {images: [], mainImage: null},
    dateOfBirth: {...new DateEntityTool().build()},
    firstName: "",
    lastName: "",
    middleName: "",
    relationships: [],
    sex: null,
    passportData: {passportSerial: "", passportNumber: "", rnokppCode: ""},
    location: null
}

export class BasicPersonCreationState extends BasicEntityCreationState<PersonCreationParams, PersonValidationObject> implements PersonCreationState {

    constructor() {
        super(initialPersonCreationParams, personDefaultValidationObject);
    }
}
