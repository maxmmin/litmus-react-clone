import {createAsyncThunk} from "@reduxjs/toolkit";
import {isValid} from "../../../util/pureFunctions";
import {ErrJson, BasicHttpError} from "../../../util/HttpStatus";
import apiLinks, {createAuthHeader, entitiesPerPage} from "../../../util/appConfig";
import {RootState} from "../../store";
import {
    BasicHumanSearchPayload,
    ExplorationParamsReducible,
    Mode,
    Entity
} from "../explorationParams";
import {Action} from "redux";
import {MetaArg} from "../../applicationState/AppState";

enum ExplorationDataActions {
    REFRESH_RESULTS="REFRESH_RESULTS",
    CLEAR_RESULTS="CLEAR_RESULTS",
    LAZY_LOAD="LAZY_LOAD"
}

export default ExplorationDataActions;

export const clearResults = (): Action<string> => {
    return {
        type: ExplorationDataActions.CLEAR_RESULTS
    }
}

export type Results = {
    data: Array<Object>,
    table?: Entity,
    pending?: boolean,
    partlyLoaded?: boolean,
    index?: number
}

export type ResultsFullRequired = {
    data: Array<Object>,
    table: Entity,
    pending: boolean,
    partlyLoaded: boolean,
    index: number
}

export type ResultsReducible = Results | null | undefined

export type RefreshResultsThunkArg = MetaArg<{
    table: Entity
 }>

const getFetchUrl = (explorationParams: ExplorationParamsReducible, table: Entity, rejectWithValue:  (value: unknown) => any, prevResults?: Results|null) => {
    let baseUrl = apiLinks[table];
    switch (explorationParams?.sectionsSettings![table]) {
        case Mode.FIND_BY_ID: {
            const id = (explorationParams.input![table] as {id: string}).id;

            if (!id) {
                throw new BasicHttpError(400, {errorDetails: {
                    // @todo write normal class for creating error details
                        validationErrors: {
                            id: "should not be null"
                        }
                    }})
            }

            baseUrl += `/${id}`;
            break;
        }

        case Mode.FIND_BY_FULL_NAME: {
            const fullNameInput = explorationParams.input![table] as BasicHumanSearchPayload;

            const firstName = fullNameInput.firstName;
            const middleName = fullNameInput.middleName;
            const lastName = fullNameInput.lastName;

            if (!lastName) {
                throw new BasicHttpError(400, {errorDetails: {
                        // @todo write normal class for creating error details
                        validationErrors: {
                            lastName: "should not be null"
                        }}});
            }

            baseUrl += `?lastName=${lastName}${middleName?"&middleName="+middleName:""}&${firstName?"&firstName="+firstName:""}`

            if (typeof prevResults?.index === 'number') {
                baseUrl += `&index=${prevResults.index+1}`
            }

            break;
        }
    }
    return baseUrl;
}

const errorResponseHandle = (response: Response, json: ErrJson, rejectWithValue: (value: unknown) => any) => {
    const error = new BasicHttpError(response.status);

    return rejectWithValue({...error})
}

const refreshResultsThunk = createAsyncThunk<ResultsFullRequired, RefreshResultsThunkArg>(ExplorationDataActions.REFRESH_RESULTS,
    async ({table},{getState, dispatch, rejectWithValue})=>{
        const state = getState() as RootState;
        const accessToken = state.authentication?.accessToken;

        if (!accessToken||!isValid(accessToken)) {
            //@todo create separate function for checkup acess token and rejectwith value if it is expired
            return rejectWithValue({...new BasicHttpError(401,{errorDetails: {
                        message: "Помилка автентифікації. Застарілий access token"
                    }})})
        }

        let fetchUrl: string = "";

        try {
            fetchUrl = getFetchUrl(state.explorationParams, table, rejectWithValue)
        } catch (error) {
            return rejectWithValue({...(error as BasicHttpError)})
        }

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

export type LazyLoadResultsThunkArg = MetaArg<{results: ResultsFullRequired} >

export const lazyLoadResultsThunk = createAsyncThunk<Results, LazyLoadResultsThunkArg>(ExplorationDataActions.LAZY_LOAD,
    async ({results}, {getState, rejectWithValue})=>{
        // it's for safety. now im sure I won't mutate original object
        results = {...results}

        const state = getState() as RootState;

        const accessToken = state.authentication?.accessToken;

        const table = results.table;

        if (!accessToken||!isValid(accessToken)) {
            //@todo separate function
            return rejectWithValue({...new BasicHttpError(401,{errorDetails: {
                        message: "Помилка автентифікації. Застарілий access token"
                    }})})
        }

        let fetchUrl: string;

        try {
            fetchUrl = getFetchUrl(state.explorationParams, table!, rejectWithValue, results)
        } catch (error) {
            return rejectWithValue({...(error as BasicHttpError)})
        }

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
