import {createAsyncThunk} from "@reduxjs/toolkit";
import {isInvalid} from "../../data/pureFunctions";
import {HttpError, httpErrors, HttpErrorsNames} from "../../data/httpErrors";
import requestsUrls, {createAuthHeader} from "../../data/requestsUrls";
import {RootState} from "../store";
import {BasicHumanSearchPayload, Modes, Tables} from "../../types/explorationParams";
import {Meta} from "../../types/AppState";

enum ApiSearchActions {
    REFRESH_RESULTS="REFRESH_RESULTS"
}

export default ApiSearchActions;

export type Results = (Array<Object>&{table?: Tables})

export type ResultsReducible = (Array<Object>&{table?: Tables}) | null | undefined

type RefreshResultsThunkArg = {
    table: Tables
} & Meta

const refreshResultsThunk = createAsyncThunk<Results, RefreshResultsThunkArg>(ApiSearchActions.REFRESH_RESULTS,
    async ({table},{getState, rejectWithValue})=>{
        const state = getState() as RootState;
        const accessToken = state.authentication?.accessToken;

        if (!accessToken||isInvalid(accessToken)) {
            return rejectWithValue({...new HttpError(401, HttpErrorsNames.UNAUTHENTICATED)})
        }

        let fetchUrl = requestsUrls[table];

        const store = getState() as RootState;

        switch (store.explorationParams?.sectionsSettings![table]) {
            case Modes.FIND_BY_ID: {
                const id = (store.explorationParams.input![table] as {id: string}).id;

                if (!id) {
                    return rejectWithValue({...new HttpError(400, HttpErrorsNames.BAD_CREDENTIALS)})
                }

                fetchUrl += `/${id}`;
                break;
            }

            case Modes.FIND_BY_FULL_NAME: {
                const fullNameInput = store.explorationParams.input![table] as BasicHumanSearchPayload;

                const firstName = fullNameInput.firstName;
                const middleName = fullNameInput.middleName;
                const lastName = fullNameInput.lastName;

                if (!firstName||!middleName||!lastName) {
                    return rejectWithValue({...new HttpError(400, HttpErrorsNames.BAD_CREDENTIALS)})
                }

                fetchUrl += `?lastName=${lastName}&middleName=${middleName}&firstName=${firstName}`
                break;
            }
        }

        const response = await fetch(fetchUrl,{
            method: 'GET',
            headers: {
                ...createAuthHeader(accessToken)
            }
        })

        let jsonResponse;

        try {
            jsonResponse = await response.json();
        } catch (e) {
            console.log(e)
        }

        if (response.ok) {
            let results: Results = new Array<Object>();
            if (jsonResponse) {
                results = results.concat(jsonResponse)
            }
            results!.table = table;
            return results as Results;
        }


        let httpErrName: HttpErrorsNames = httpErrors[response.status];

        if (httpErrName===undefined) {
            httpErrName = HttpErrorsNames.UNKNOWN_ERROR;
        }

        const error = new HttpError(response.status,httpErrName,jsonResponse);

        return rejectWithValue({...error})
    })

export {refreshResultsThunk};
