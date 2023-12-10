import EntityCreationState, {BasicEntityCreationState} from "./EntityCreationState";
import {DateEntityTool} from "../../../model/DateEntity";
import {
    personDefaultValidationObject,
    PersonValidationObject
} from "../../../service/validation/human/person/PersonCreationValidationService";
import {PersonCreationParams} from "../../../service/coreServices/creation/PersonCreationService";

export default interface PersonCreationState extends EntityCreationState<PersonCreationParams, PersonValidationObject>{}

export const initialPersonCreationParams: PersonCreationParams = {
    media: {images: [], mainImage: null},
    dateOfBirth: {...new DateEntityTool().build()},
    firstName: "",
    lastName: "",
    middleName: "",
    relationships: [],
    sex: null,
    passportData: {passportSerial: "", passportNumber: "", rnokppCode: ""},
    location: null,
    sources: []
}

export class BasicPersonCreationState extends BasicEntityCreationState<PersonCreationParams, PersonValidationObject> implements PersonCreationState {

    constructor() {
        super(initialPersonCreationParams, personDefaultValidationObject);
    }
}
