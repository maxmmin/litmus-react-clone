import ExplorationDataActions, {LazyLoadResultsThunkArg, Results, ResultsReducible} from "./ExplorationDataActions";
import {Reducer} from "react";
import {BasicHttpError} from "../../../util/HttpStatus";
import AuthActions from "../../auth/AuthActions";
import {PayloadAction} from "@reduxjs/toolkit";
import {RefreshResultsThunkArg} from "./ExplorationDataActions"
import {Entity} from "../explorationParams";

const initialState = null;

type PendingMetaAction = {
    meta: {
        arg: RefreshResultsThunkArg & LazyLoadResultsThunkArg
    }
}

const explorationDataReducer: Reducer<ResultsReducible, PayloadAction<Results>> = (prevState=initialState, action) => {
    switch (action.type) {
        case (ExplorationDataActions.REFRESH_RESULTS): {
            return action.payload;
        }

        case (`${ExplorationDataActions.LAZY_LOAD}/pending`): {
            const newState: Results = {...prevState!, pending: true}

            return newState;
        }

        case (`${ExplorationDataActions.REFRESH_RESULTS}/pending`): {
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

        case (`${ExplorationDataActions.LAZY_LOAD}/fulfilled`):
        case (`${ExplorationDataActions.REFRESH_RESULTS}/fulfilled`): {
            return action.payload;
        }

        case (`${ExplorationDataActions.LAZY_LOAD}/rejected`):
        case (`${ExplorationDataActions.REFRESH_RESULTS}/rejected`): {
            const error = action.payload as unknown as BasicHttpError;

            if (error?.status) {
                // only lazy load, because if it's refresh results actions prev state cant be null
                if (error.status===400&&action.type===`${ExplorationDataActions.LAZY_LOAD}/rejected`) {
                    return {...prevState!, pending: false};
                }
            }

            return null;
        }

        case ExplorationDataActions.CLEAR_RESULTS: {
            return initialState;
        }

        case AuthActions.CLEAR_AUTH: {
            return initialState
        }

        default: return prevState;
    }
}

export default explorationDataReducer