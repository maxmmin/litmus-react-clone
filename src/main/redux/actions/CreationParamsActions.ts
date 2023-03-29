import {Tables} from "../../types/explorationParams";
import {PayloadAction} from "@reduxjs/toolkit";
import GetPersonDto from "../../types/person/GetPersonDto";
import {Location} from "../../types/Location";
import {JurPersonCreationData} from "../../types/jurPerson/JurPersonCreationData";
import {DateEntity, getInitialDate} from "../../types/DateEntity";
import PersonCreationData from "../../types/person/PersonCreationData";
import UserCreationData from "../../types/user/UserCreationData";

enum CreationParamsActions {
    SET_CREATION_PARAMS="SET_CREATION_PARAMS",
    UPDATE_CREATION_PARAMS="UPDATE_CREATION_PARAMS",
    UPDATE_JUR_PERSON_CREATION_DATA="UPDATE_JUR_PERSON_CREATION_DATA",
    UPDATE_PERSON_CREATION_DATA="UPDATE_PERSON_CREATION_DATA",
    UPDATE_USER_CREATION_DATA="UPDATE_USER_CREATION_DATA",
    SET_CREATION_PENDING="SET_CREATION_PENDING"
}

export default CreationParamsActions;

export const updateCreationParams = (payload: Partial<CreationParams>): PayloadAction<Partial<CreationParams>> => {
    return {
        type: CreationParamsActions.UPDATE_CREATION_PARAMS,
        payload: payload
    }
}

export const updateJurPersonCreationParams = (payload: Partial<JurPersonCreationData>): PayloadAction<Partial<JurPersonCreationData>> => {
    return {
        type: CreationParamsActions.UPDATE_JUR_PERSON_CREATION_DATA,
        payload: payload
    }
}

export const updateUserCreationParams = (payload: Partial<UserCreationData>): PayloadAction<Partial<UserCreationData>> => {
    return {
        type: CreationParamsActions.UPDATE_USER_CREATION_DATA,
        payload: payload
    }
}

export const updatePersonCreationParams = (payload: Partial<PersonCreationData>): PayloadAction<Partial<PersonCreationData>> => {
    return {
        type: CreationParamsActions.UPDATE_PERSON_CREATION_DATA,
        payload: payload
    }
}

export class InitPersonCreationParams implements PersonCreationData {
    dateOfBirth: DateEntity = getInitialDate();
    firstName: string = "";
    lastName: string = "";
    middleName: string = "";
    passportNumber: string = "";
    passportSerial: string = "";
    location = null;
    rnokppCode: string = "";
}

export class InitUserCreationParams implements UserCreationData {
    email: string = "";
    firstName: string = "";
    lastName: string = "";
    middleName: string = "";
    password: string = "";
    role: string = "";
}

export class InitJurPersonCreationParams implements JurPersonCreationData {
    benOwner: GetPersonDto | null = null;
    dateOfRegistration: DateEntity = getInitialDate();
    edrpou: string = "";
    name: string = "";
    owner: GetPersonDto | null = null;
    location: Location | null = null;
}

export type CreationParams = {
    table: Tables,
    personCreationData: PersonCreationData,
    jurPersonCreationData: JurPersonCreationData,
    userCreationData: UserCreationData,
    pending: boolean
}

export const setPending = (arg: boolean): PayloadAction<boolean> => {
    return {
        type: CreationParamsActions.SET_CREATION_PENDING,
        payload: arg
    }
}

export type CreationParamsReducible = CreationParams | undefined