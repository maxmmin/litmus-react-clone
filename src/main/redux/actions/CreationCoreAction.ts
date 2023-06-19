import {RoleName} from "../types/userIdentity/Role";
import {DateBuilder} from "../../model/DateEntity";
import Person from "../../model/human/person/Person";
import User from "../../model/human/user/User";
import {JurPerson} from "../../model/jurPerson/JurPerson";

enum CreationCoreAction {
    SET_ENTITY_CREATION_PARAMS="SET_ENTITY_CREATION_PARAMS",
    UPDATE_ENTITY_CREATION_PARAMS="UPDATE_CREATION_PARAMS",
    CREATE_ENTITY="CREATE_ENTITY"
}

export enum PersonCreationAction {
    UPDATE_PASSPORT_DATA="UPDATE_PASSPORT_DATA",
    ADD_PERSON_RELATION="ADD_PERSON_RELATION",
    REMOVE_PERSON_RELATION="REMOVE_PERSON_RELATION",
    UPDATE_PERSON_RELATION="UPDATE_PERSON_RELATION"
}

export default CreationCoreAction;

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

export const initialUserCreationParams: User = {
    id: '-1',
    email: "",
    firstName:  "",
    lastName: "",
    middleName: "",
    password: "",
    role: RoleName.USER
}

export const initialJurPersonCreationParams: JurPerson = {
    id: '-1',
    benOwner: null,
    dateOfRegistration:  {...new DateBuilder().build()},
    edrpou:  "",
    name: "",
    owner: null,
    location: null
}
