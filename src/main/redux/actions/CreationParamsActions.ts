import {Tables} from "../../types/explorationParams";
import {PayloadAction} from "@reduxjs/toolkit";
import CreatePersonDto from "../../types/CreatePersonDto";
import CreateJurPersonDto from "../../types/CreateJurPersonDto";
import CreateUserDto from "../../types/CreateUserDto";

export enum CreationParamsActions {
    SET_CREATION_PARAMS="SET_CREATION_PARAMS",
    UPDATE_CREATION_PARAMS="UPDATE_CREATION_PARAMS"
}

const updateCreationParams = (payload: CreationParams): PayloadAction<CreationParams> => {
    return {
        type: CreationParamsActions.UPDATE_CREATION_PARAMS,
        payload: payload
    }
}

export type CreationParams = {
    table: Tables,
    personCreationData?: CreatePersonDto,
    createJurPersonData?: CreateJurPersonDto,
    createUserData?: CreateUserDto
}

export type CreationParamsReducible = CreationParams | null | undefined