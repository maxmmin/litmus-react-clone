import {ApiSearchActions, Results, ResultsReducible} from "../actions/ApiSearchActions";
import {Reducer} from "react";
import {HttpError} from "../../data/httpErrors";
import {AuthActions} from "../actions/AuthActions";
import {PayloadAction} from "@reduxjs/toolkit";
import store from "../store";

const initialState = null;

const apiSearchReducer: Reducer<ResultsReducible, PayloadAction<Results>> = (prevState=initialState, action) => {
    switch (action.type) {
        case (ApiSearchActions.REFRESH_RESULTS): {
            return action.payload;
        }
        case (`${ApiSearchActions.REFRESH_RESULTS}/fulfilled`): {
            return action.payload;
        }
        case (`${ApiSearchActions.REFRESH_RESULTS}/rejected`): {
            const error = action.payload as unknown as HttpError;

            if (error?.status) {
                if (error.status===400) {
                    const results: Results = []
                    results.table = store.getState().explorationParams?.table;
                    return results;
                }

            }
            return null;
        }

        case AuthActions.CLEAR_AUTH: {
            return initialState
        }

        default: return prevState;
    }
}

export default apiSearchReducer