import {Reducer} from "react";
import {CreationParams, CreationParamsActions, CreationParamsReducible} from "../actions/CreationParamsActions";
import {PayloadAction} from "@reduxjs/toolkit";
import {Tables} from "../../types/explorationParams";

const initialState: CreationParams = {
    table: Tables.USERS
}

const creationParamsReducer: Reducer<CreationParamsReducible, PayloadAction<CreationParams>> = (prevState= initialState, action) => {
    switch (action.type) {
        case CreationParamsActions.SET_CREATION_PARAMS: {
            return action.payload;
        }

        case CreationParamsActions.UPDATE_CREATION_PARAMS: {
            if (!prevState) {
                return {...initialState, ...action.payload};
            }
            return {...prevState, ...action.payload}
        }

        default: {
            return prevState;
        }
    }
}

export default creationParamsReducer;