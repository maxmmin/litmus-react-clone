import ApiSearchActions, {LazyLoadResultsThunkArg, Results, ResultsReducible} from "../actions/ApiSearchActions";
import {Reducer} from "react";
import {HttpError} from "../../data/httpErrors";
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

        case (`${ApiSearchActions.LAZY_LOAD}/pending`):
        case (`${ApiSearchActions.REFRESH_RESULTS}/pending`): {
            let table: Tables;
            let metaAction = action as unknown as PendingMetaAction;

            if (metaAction.meta.arg.table) {
                table = metaAction.meta.arg.table;
            } else if (metaAction.meta.arg.results) {
                table = metaAction.meta.arg.results.table;
            }

            const newState: Results = {
                data: new Array<Object>(),
                pending: true,
                table: table!,
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
            const error = action.payload as unknown as HttpError;

            if (error?.status) {
                if (error.status===400) {
                    return prevState;
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