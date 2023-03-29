import {Tables} from "../../types/explorationParams";
import {PayloadAction} from "@reduxjs/toolkit";
import GetPersonDto from "../../types/person/GetPersonDto";
import {Location} from "../../types/Location";
import {JurPersonCreationData} from "../../types/jurPerson/JurPersonCreationData";
import {DateEntity, getInitialDate} from "../../types/DateEntity";
import PersonCreationData from "../../types/person/PersonCreationData";
import UserCreationData from "../../types/user/UserCreationData";
import CreatePersonDto from "../../types/person/CreatePersonDto";
import {DateBuilder} from "../../data/pureFunctions";
import CreateUserDto from "../../types/user/CreateUserDto";
import CreateJurPersonDto from "../../types/jurPerson/CreateJurPersonDto";

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

export const getCreatePersonDto = (creationData: PersonCreationData): CreatePersonDto => {
    const DOB = creationData.dateOfBirth;

    let createDtoDate: string | null = null;

    if (DOB) {
        createDtoDate = new DateBuilder().setDay(DOB.day).setMonth(DOB.month).setYear(DOB.year).buildStringDate();
    }

    const passportNumber = +creationData.passportNumber!;

    const passportSerial = +creationData.passportSerial!;

    const rnokppCode = +creationData.rnokppCode!;

    return {
        dateOfBirth: createDtoDate,
        firstName: creationData.firstName,
        lastName: creationData.lastName,
        location: creationData.location?creationData.location:null,
        middleName: creationData.middleName,
        passportNumber: passportNumber?passportNumber:null,
        passportSerial: passportSerial?passportSerial:null,
        rnokppCode: rnokppCode?rnokppCode:null
    }
}
// @todo i think middle name should be optional
export const getCreateUserDto = (creationData: UserCreationData): CreateUserDto => {
    return {
        email: creationData.email, firstName: creationData.firstName, lastName: creationData.lastName, middleName: creationData.middleName, password: creationData.password, role: creationData.role?creationData.role:null
    }
}
// @todo in future, you need check, can u store id in number typed variable. it can be long ;)
export const getCreateJurPersonDto = (creationData: JurPersonCreationData): CreateJurPersonDto => {
    const benOwnerId = creationData.benOwner?creationData.benOwner.id:null
    const ownerId = creationData.owner?creationData.owner.id:null

    const DOR = creationData.dateOfRegistration;

    let createDtoDate: string | null = null;

    if (DOR) {
        createDtoDate = new DateBuilder().setDay(DOR.day).setMonth(DOR.month).setYear(DOR.year).buildStringDate();
    }

    return  {
        benOwnerId: benOwnerId,
        dateOfRegistration: createDtoDate,
        edrpou: creationData.edrpou?creationData.edrpou:null,
        location: creationData.location,
        name: creationData.name,
        ownerId: ownerId
    }
}