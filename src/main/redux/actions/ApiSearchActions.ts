import {createAsyncThunk} from "@reduxjs/toolkit";
import {isInvalid} from "../../data/pureFunctions";
import {ErrJson, HttpError, httpErrors, HttpErrorsNames} from "../../data/httpErrors";
import appConfig, {createAuthHeader, entitiesPerPage} from "../../data/appConfig";
import {RootState} from "../store";
import {
    BasicHumanSearchPayload,
    ExplorationParams,
    ExplorationParamsReducible,
    Modes,
    Tables
} from "../../types/explorationParams";
import {Meta} from "../../types/AppState";
import {Action} from "redux";

enum ApiSearchActions {
    REFRESH_RESULTS="REFRESH_RESULTS",
    CLEAR_RESULTS="CLEAR_RESULTS",
    LAZY_LOAD="LAZY_LOAD"
}

export default ApiSearchActions;

export const clearResults = (): Action<string> => {
    return {
        type: ApiSearchActions.CLEAR_RESULTS
    }
}

export type Results = {
    data: Array<Object>,
    table?: Tables,
    pending?: boolean,
    partlyLoaded?: boolean,
    index?: number
}

export type ResultsFullRequired = {
    data: Array<Object>,
    table: Tables,
    pending: boolean,
    partlyLoaded: boolean,
    index: number
}

export type ResultsReducible = Results | null | undefined

export type RefreshResultsThunkArg = {
    table: Tables
} & Meta

const getFetchUrl = (explorationParams: ExplorationParamsReducible, table: Tables, rejectWithValue:  (value: unknown) => any, prevResults?: Results|null) => {
    let baseUrl = appConfig[table];
    switch (explorationParams?.sectionsSettings![table]) {
        case Modes.FIND_BY_ID: {
            const id = (explorationParams.input![table] as {id: string}).id;

            if (!id) {
                return rejectWithValue({...new HttpError(400, HttpErrorsNames.BAD_CREDENTIALS)})
            }

            baseUrl += `/${id}`;
            break;
        }

        case Modes.FIND_BY_FULL_NAME: {
            const fullNameInput = explorationParams.input![table] as BasicHumanSearchPayload;

            const firstName = fullNameInput.firstName;
            const middleName = fullNameInput.middleName;
            const lastName = fullNameInput.lastName;

            if (!firstName||!middleName||!lastName) {
                return rejectWithValue({...new HttpError(400, HttpErrorsNames.BAD_CREDENTIALS)})
            }

            baseUrl += `?lastName=${lastName}&middleName=${middleName}&firstName=${firstName}`

            if (typeof prevResults?.index === 'number') {
                baseUrl += `&index=${prevResults.index+1}`
            }

            break;
        }
    }
    return baseUrl;
}

const errorResponseHandle = (response: Response, json: ErrJson, rejectWithValue: (value: unknown) => any) => {
    let httpErrName: HttpErrorsNames = httpErrors[response.status];

    if (httpErrName===undefined) {
        httpErrName = HttpErrorsNames.UNKNOWN_ERROR;
    }

    const error = new HttpError(response.status,httpErrName, json);

    return rejectWithValue({...error})
}

const refreshResultsThunk = createAsyncThunk<ResultsFullRequired, RefreshResultsThunkArg>(ApiSearchActions.REFRESH_RESULTS,
    async ({table},{getState, dispatch, rejectWithValue})=>{
        const state = getState() as RootState;
        const accessToken = state.authentication?.accessToken;

        if (!accessToken||isInvalid(accessToken)) {
            return rejectWithValue({...new HttpError(401, HttpErrorsNames.UNAUTHENTICATED)})
        }

        dispatch(clearResults())


        const fetchUrl = getFetchUrl(state.explorationParams, table, rejectWithValue)

        const response = await fetch(fetchUrl,{
            method: 'GET',
            headers: {
                ...createAuthHeader(accessToken)
            }
        })

        let jsonResponse: Object = [];

        try {
            jsonResponse = await response.json();
        } catch (e) {
            console.log(e)
        }

        if (response.ok) {
            let results: Results = {
                data: [],
                table: table,
                pending: false,
                index: 0
            };

            results.data = results.data.concat(jsonResponse)

            results.partlyLoaded = results.data.length===entitiesPerPage

            return results;
        }

        return errorResponseHandle(response, jsonResponse as ErrJson, rejectWithValue)
    })

export type LazyLoadResultsThunkArg = {results: ResultsFullRequired} & Meta

export const lazyLoadResultsThunk = createAsyncThunk<Results, LazyLoadResultsThunkArg>(ApiSearchActions.LAZY_LOAD,
    async ({results}, {getState, rejectWithValue})=>{
        // it's for safety. now im sure I won't mutate original object
        results = {...results}

        const state = getState() as RootState;

        const accessToken = state.authentication?.accessToken;

        const table = results.table;

        if (!accessToken||isInvalid(accessToken)) {
            return rejectWithValue({...new HttpError(401, HttpErrorsNames.UNAUTHENTICATED)})
        }

        const fetchUrl = getFetchUrl(state.explorationParams, table!, rejectWithValue, results)

        const response = await fetch(fetchUrl,{
            method: 'GET',
            headers: {
                ...createAuthHeader(accessToken)
            }
        })

        let jsonResponse: Array<Object> = [];

        try {
            jsonResponse = await response.json();
        } catch (e) {
            console.log(e)
        }

        if (response.ok) {

            results.data = results.data.concat(jsonResponse)
            results.index++
            results.pending = false
            results.partlyLoaded = jsonResponse.length===entitiesPerPage

            return results;
        }

        return errorResponseHandle(response, jsonResponse as unknown as ErrJson, rejectWithValue)
    })

export {refreshResultsThunk};
