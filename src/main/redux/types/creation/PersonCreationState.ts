import EntityCreationState, {BasicEntityCreationState} from "./EntityCreationState";
import Person from "../../../model/human/person/Person";
import {DateBuilder} from "../../../model/DateEntity";

export default interface PersonCreationState extends EntityCreationState<Person>{}

export const initialPersonCreationParams: Person = {
    id: '-1',
    dateOfBirth: {...new DateBuilder().build()},
    firstName: "",
    lastName: "",
    middleName: "",
    relationships: [],
    sex: null,
    passportData: {passportSerial: "", passportNumber: "", rnokppCode: ""},
    location: null
}

export class BasicPersonCreationState extends BasicEntityCreationState<Person> implements PersonCreationState {

    constructor() {
        super(initialPersonCreationParams, {});
    }
}