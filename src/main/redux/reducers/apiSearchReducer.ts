import ApiSearchActions, {LazyLoadResultsThunkArg, Results, ResultsReducible} from "../actions/ApiSearchActions";
import {Reducer} from "react";
import {BasicHttpError} from "../../util/HttpStatus";
import AuthActions from "../actions/AuthActions";
import {PayloadAction} from "@reduxjs/toolkit";
import {RefreshResultsThunkArg} from "../actions/ApiSearchActions"
import {Tables} from "../../types/explorationParams";

const initialState = null;

type PendingMetaAction = {
    meta: {
        arg: RefreshResultsThunkArg & LazyLoadResultsThunkArg
    }
}

const apiSearchReducer: Reducer<ResultsReducible, PayloadAction<Results>> = (prevState=initialState, action) => {
    switch (action.type) {
        case (ApiSearchActions.REFRESH_RESULTS): {
            return action.payload;
        }

        case (`${ApiSearchActions.LAZY_LOAD}/pending`): {
            const newState: Results = {...prevState!, pending: true}

            return newState;
        }

        case (`${ApiSearchActions.REFRESH_RESULTS}/pending`): {
            let metaAction = action as unknown as PendingMetaAction;

            const newState: Results = {
                data: new Array<Object>(),
                pending: true,
                table:  metaAction.meta.arg.table!,
                partlyLoaded: false,
                index: 0
            }

            return newState;
        }

        case (`${ApiSearchActions.LAZY_LOAD}/fulfilled`):
        case (`${ApiSearchActions.REFRESH_RESULTS}/fulfilled`): {
            return action.payload;
        }

        case (`${ApiSearchActions.LAZY_LOAD}/rejected`):
        case (`${ApiSearchActions.REFRESH_RESULTS}/rejected`): {
            const error = action.payload as unknown as BasicHttpError;

            if (error?.status) {
                // only lazy load, because if it's refresh results actions prev state cant be null
                if (error.status===400&&action.type===`${ApiSearchActions.LAZY_LOAD}/rejected`) {
                    return {...prevState!, pending: false};
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