import {Reducer} from "react";
import CreationParamsActions, {
    CreationParams,
    CreationParamsReducible, InitJurPersonCreationParams,
    InitPersonCreationParams, InitUserCreationParams
} from "../actions/CreationParamsActions";
import {PayloadAction} from "@reduxjs/toolkit";
import {Tables} from "../../types/explorationParams";
import CreateJurPersonDto from "../../types/CreateJurPersonDto";

const initialState: CreationParams = {
    table: Tables.PERSONS,
    jurPersonCreationData: {...new InitJurPersonCreationParams()},
    personCreationData: {...new InitPersonCreationParams()},
    userCreationData: {...new InitUserCreationParams()}
}

const creationParamsReducer: Reducer<CreationParamsReducible, PayloadAction<CreationParams>> = (prevState= initialState, action) => {
    switch (action.type) {
        case CreationParamsActions.SET_CREATION_PARAMS: {
            return action.payload;
        }

        case CreationParamsActions.UPDATE_CREATION_PARAMS: {
            return {...prevState, ...action.payload}
        }

        case CreationParamsActions.UPDATE_JUR_PERSON_DATA: {
            return {...prevState, jurPersonCreationData: {...prevState.jurPersonCreationData, ...(action.payload as unknown as CreateJurPersonDto)}}
        }

        default: {
            return prevState;
        }
    }
}

export default creationParamsReducer;