import AppState, {AppStateReducible, Meta} from "../../types/AppState";
import {Reducer} from "react";
import {Action} from "redux";
import AppStateActions from "../actions/AppStateActions";
import AuthActions from "../actions/AuthActions";
import {PayloadAction} from "@reduxjs/toolkit";
import {HttpError, httpErrors, HttpErrorsNames} from "../../data/httpErrors";
import ApiSearchActions from "../actions/ApiSearchActions";

const initialState: AppState = {isRefreshing: false, isHeaderMenuOpened: false}

type PendingMetaAction = {
    meta: {
        arg: Meta
    }
}

const appStateReducer: Reducer<AppStateReducible, Action<String>> = (prevState = initialState, action) => {

    switch (action.type) {
        case AppStateActions.REFRESH_ON: {
            return {...prevState, isRefreshing: true}
        }

        case AppStateActions.REFRESH_OFF: {
            return { ...prevState, isRefreshing: false}
        }

        case AppStateActions.HEADER_MENU_TOGGLE: {
            return {...prevState, isHeaderMenuOpened: !prevState!.isHeaderMenuOpened}
        }

        case AppStateActions.HEADER_MENU_CLOSE: {
            return {...prevState, isHeaderMenuOpened: false}
        }

        case AppStateActions.CLEAR_ERROR: {
            return {...prevState, error: null}
        }

        case AuthActions.CLEAR_AUTH: {
            return initialState
        }

        default: {

            if (action.type.endsWith("/pending")) {
                const metaAction = action as unknown as PendingMetaAction;

                if (metaAction.meta.arg.shouldRefreshGlobally) {
                    return {...prevState, isRefreshing: true}
                }

                return prevState;
            }

            if (action.type.endsWith("/fulfilled")||action.type.endsWith("/rejected")) {
                let newState: AppState = {...prevState, isRefreshing: false}

                if (action.type.endsWith("/rejected")) {
                    const clearType = action.type.slice(0,-("/rejected").length);

                    switch (clearType) {
                        case ApiSearchActions.REFRESH_RESULTS: {
                            const httpError = (action as PayloadAction<HttpError>).payload
                            if (httpError) {
                                const status = httpError.status
                                if (status&&httpErrors[status]===HttpErrorsNames.UNAUTHENTICATED) {
                                    newState.error = {}
                                }
                            }
                            break;
                        }

                        case AuthActions.REFRESH_AUTH: {
                            const httpError = (action as Partial<PayloadAction<HttpError>>).payload
                            if (httpError?.status) {
                                const status = httpError.status
                                if (status&&httpErrors[status]===HttpErrorsNames.UNAUTHENTICATED) {
                                    newState.error = {message: "Невірні дані користувача"}
                                }
                            }
                            break;
                        }
                    }

                }

                return newState;
            }

            return prevState;
        }
    }
}

export default appStateReducer;