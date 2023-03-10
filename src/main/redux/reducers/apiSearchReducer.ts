import  {ApiSearchAction, ApiSearchActions, Results} from "../actions/ApiSearchActions";
import {Reducer} from "react";
import {HttpError} from "../../data/httpErrors";
import {AuthActions} from "../actions/AuthActions";

const initialState = null;

const apiSearchReducer: Reducer<Results, ApiSearchAction> = (
    prevState=initialState, action) => {
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
                    if (prevState?.table) {
                        results.table = prevState.table;
                    }
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