import ApiSearchActions, {Results, ResultsReducible} from "../actions/ApiSearchActions";
import {Reducer} from "react";
import {HttpError} from "../../data/httpErrors";
import AuthActions from "../actions/AuthActions";
import {PayloadAction} from "@reduxjs/toolkit";

const initialState = null;

const apiSearchReducer: Reducer<ResultsReducible, PayloadAction<Results>> = (prevState=initialState, action) => {
    switch (action.type) {
        case (ApiSearchActions.REFRESH_RESULTS): {
            return action.payload;
        }

        case (`${ApiSearchActions.REFRESH_RESULTS}/pending`): {
            const newState: Results = prevState?[...prevState]:[];
            newState.pending = true;
            newState.table = prevState?.table;
            return newState;
        }

        case (`${ApiSearchActions.REFRESH_RESULTS}/fulfilled`): {
            return action.payload;
        }
        case (`${ApiSearchActions.REFRESH_RESULTS}/rejected`): {
            const error = action.payload as unknown as HttpError;

            if (error?.status) {
                if (error.status===400) {
                    const results: Results = []
                    return results;
                }
            }
            return null;
        }

        case ApiSearchActions.CLEAR_RESULTS: {
            return initialState;
        }

        case AuthActions.CLEAR_AUTH: {
            return initialState
        }

        default: return prevState;
    }
}

export default apiSearchReducer