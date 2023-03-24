import {Tables} from "../../types/explorationParams";
import {AsyncThunk, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import CreatePersonDto from "../../types/CreatePersonDto";
import CreateJurPersonDto from "../../types/CreateJurPersonDto";
import CreateUserDto from "../../types/CreateUserDto";
import GetPersonDto from "../../types/GetPersonDto";
import {Location} from "../../types/Location";

enum CreationParamsActions {
    SET_CREATION_PARAMS="SET_CREATION_PARAMS",
    UPDATE_CREATION_PARAMS="UPDATE_CREATION_PARAMS",
    UPDATE_JUR_PERSON_DATA="UPDATE_JUR_PERSON_DATA",
    SET_LOCAL_PENDING="SET_LOCAL_PENDING"
}

export default CreationParamsActions;

export const updateCreationParams = (payload: Partial<CreationParams>): PayloadAction<Partial<CreationParams>> => {
    return {
        type: CreationParamsActions.UPDATE_CREATION_PARAMS,
        payload: payload
    }
}

export const updateJurPersonCreationParams = (payload: Partial<CreateJurPersonDto>): PayloadAction<Partial<CreateJurPersonDto>> => {
    return {
        type: CreationParamsActions.UPDATE_JUR_PERSON_DATA,
        payload: payload
    }
}

export class InitPersonCreationParams implements CreatePersonDto {
    dateOfBirth: string = "";
    firstName: string = "";
    lastName: string = "";
    middleName: string = "";
    passportNumber: string = "";
    passportSerial: string = "";
    place: any;
    rnokppCode: string = "";
}

export class InitUserCreationParams implements CreateUserDto {
    email: string = "";
    firstName: string = "";
    lastName: string = "";
    middleName: string = "";
    password: string = "";
    role: string = "";
}

export class InitJurPersonCreationParams implements CreateJurPersonDto {
    benOwner: GetPersonDto | null = null;
    dateOfRegistration: string = "";
    edrpou: string = "";
    name: string = "";
    owner: GetPersonDto | null = null;
    address: Location | null = null;
}

export type CreationParams = {
    table: Tables,
    personCreationData: CreatePersonDto,
    jurPersonCreationData: CreateJurPersonDto,
    userCreationData: CreateUserDto,
    pending: boolean
}

export const setPending = (arg: boolean): PayloadAction<boolean> => {
    return {
        type: CreationParamsActions.SET_LOCAL_PENDING,
        payload: arg
    }
}

export type CreationParamsReducible = CreationParams | undefined