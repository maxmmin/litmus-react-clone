import EntityCreationState, {BasicEntityCreationState} from "./EntityCreationState";
import Person from "../../../model/human/person/Person";
import {DateEntityTool} from "../../../model/DateEntity";
import {
    PersonValidationObject
} from "../../../service/creation/validation/human/person/PersonCreationValidationService";

export default interface PersonCreationState extends EntityCreationState<Person, PersonValidationObject>{}

export const initialPersonCreationParams: Person = {
    id: '-1',
    dateOfBirth: {...new DateEntityTool().build()},
    firstName: "",
    lastName: "",
    middleName: "",
    relationships: [],
    sex: null,
    passportData: {passportSerial: "", passportNumber: "", rnokppCode: ""},
    location: null
}

export class BasicPersonCreationState extends BasicEntityCreationState<Person, PersonValidationObject> implements PersonCreationState {

    constructor() {
        super(initialPersonCreationParams, {relationships: []});
    }
}
