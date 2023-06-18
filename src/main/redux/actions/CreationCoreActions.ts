import {Location} from "../../model/Location";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import Person from "../../model/human/person/Person";
import User from "../../model/human/user/User";
import {RoleName} from "../types/userIdentity/Role";
import DateEntity, {DateBuilder} from "../../model/DateEntity";

enum CreationCoreActions {
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

export default CreationCoreActions;

export interface PersonCreationParams extends Person {}

export const initialPersonCreationParams: PersonCreationParams = {
    dateOfBirth: {...new DateBuilder().build()},
    firstName: "",
    lastName: "",
    middleName: "",
    relationships: [],
    sex: null,
    passportData: {passportSerial: "", passportNumber: "", rnokppCode: ""},
    location: null
}

export interface UserCreationParams extends User {}

export const initialUserCreationParams: UserCreationParams = {
    email: "",
    firstName:  "",
    lastName: "",
    middleName: "",
    password: "",
    role: RoleName.USER
}

export interface JurPersonCreationParams extends JurPerson {}

export const initialJurPersonCreationParams: JurPersonCreationParams = {
    benOwner: null,
    dateOfRegistration:  {...new DateBuilder().build()},
    edrpou:  "",
    name: "",
    owner: null,
    location: null
}
