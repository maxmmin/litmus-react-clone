import Person, {Relationship} from "../../model/human/person/Person";
import {RoleName} from "../types/userIdentity/Role";
import DateEntity, {DateBuilder} from "../../model/DateEntity";
import Sex from "../../model/human/person/Sex";
import {Location} from "../../model/Location";
import {CreationPassportData} from "../../model/human/person/PassportData";

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

export interface PersonCreationParams {
    firstName: string;
    middleName: string;
    lastName: string;
    relationships: Relationship[],
    sex: Sex | null;
    passportData: CreationPassportData;
    dateOfBirth: DateEntity;
    location: Location | null
}

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

export interface UserCreationParams {
    email: string;

    firstName: string;

    middleName: string;

    lastName: string;

    password: string

    role: RoleName;
}

export const initialUserCreationParams: UserCreationParams = {
    email: "",
    firstName:  "",
    lastName: "",
    middleName: "",
    password: "",
    role: RoleName.USER
}

export interface JurPersonCreationParams {
    name: string;
    edrpou: string;
    dateOfRegistration: DateEntity;
    owner: Person | null;
    benOwner: Person | null;
    location: Location | null;
}

export const initialJurPersonCreationParams: JurPersonCreationParams = {
    benOwner: null,
    dateOfRegistration:  {...new DateBuilder().build()},
    edrpou:  "",
    name: "",
    owner: null,
    location: null
}
