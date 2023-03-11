import {Tables} from "../../types/explorationParams";
import {PayloadAction} from "@reduxjs/toolkit";

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
    personCreationData: {
        lastName: string,
        middleName: string,
        firstName: string,
        passportNumber: number,
        passportSerial: number,
        rnokppCode: number,

    }
}

export type CreationParamsReducible = CreationParams | null | undefined