import {Reducer} from "react";
import CreationParamsActions, {
    CreationParams,
    CreationParamsReducible, InitJurPersonCreationParams,
    InitPersonCreationParams, InitUserCreationParams
} from "../actions/CreationParamsActions";
import {PayloadAction} from "@reduxjs/toolkit";
import {Tables} from "../../types/explorationParams";
import AuthActions from "../actions/AuthActions";
import {JurPerson} from "../../types/JurPerson";
import Person from "../../types/Person";
import User from "../../types/User";
import {PassportData} from "../../types/PassportData";
import Sex from "../../types/Sex";

const initialState: CreationParams = {
    table: Tables.PERSONS,
    jurPersonCreationData: {...new InitJurPersonCreationParams()},
    personCreationData: {...new InitPersonCreationParams()},
    userCreationData: {...new InitUserCreationParams()},
    pending: false
}

const creationParamsReducer: Reducer<CreationParamsReducible, PayloadAction<CreationParams>> = (prevState= initialState, action) => {
    switch (action.type) {
        case CreationParamsActions.SET_CREATION_PARAMS: {
            return action.payload;
        }

        case CreationParamsActions.UPDATE_CREATION_PARAMS: {
            return {...prevState, ...action.payload}
        }

        case CreationParamsActions.UPDATE_JUR_PERSON_CREATION_DATA: {
            return {...prevState, jurPersonCreationData: {...prevState.jurPersonCreationData, ...(action.payload as unknown as Partial<JurPerson>)}}
        }

        case CreationParamsActions.UPDATE_PERSON_CREATION_DATA: {
            return {...prevState, personCreationData: {...prevState.personCreationData, ...(action.payload as unknown as Partial<Person>)}}
        }

        case CreationParamsActions.UPDATE_PERSON_SEX: {
            return {...prevState, personCreationData: {...prevState.personCreationData, sex: action.payload as unknown as Sex}}
        }

        case CreationParamsActions.UPDATE_USER_CREATION_DATA: {
            return {...prevState, userCreationData: {...prevState.userCreationData, ...(action.payload as unknown as Partial<User>)}}
        }

        case CreationParamsActions.UPDATE_PASSPORT_DATA: {
            const payload = action.payload as unknown as Partial<PassportData>;

            let passportData: PassportData = Object.assign({},prevState.personCreationData.passportData, payload);
            return {...prevState, personCreationData: {...prevState.personCreationData, passportData}}
        }

        case AuthActions.CLEAR_AUTH: {
            return initialState
        }

        case CreationParamsActions.SET_CREATION_PENDING: {
            const act = action as unknown as PayloadAction<boolean>
            return {...prevState, pending: act.payload}
        }

        default: {
            return prevState;
        }
    }
}

export default creationParamsReducer;