import AppState, {
    AppStateReducible,
    GmapsApiResponse,
    Meta,
    MetaArg
} from "./AppState";
import {Reducer} from "react";
import {Action} from "redux";
import AppStateActions from "./AppStateActions";
import AuthActions from "../auth/AuthActions";
import {PayloadAction} from "@reduxjs/toolkit";
import Notification from "./Notification";
import {isActionFulfilled, isActionPending, isActionRejected} from "../../util/pureFunctions";

const initialState: AppState = {isRefreshing: false, isHeaderMenuOpened: false, gmapsApiState: null, notifications: []}

export type MetaAction = {
    meta?: {
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

        case AuthActions.CLEAR_AUTH: {
            return {...initialState, gmapsApiState: prevState.gmapsApiState}
        }

        case AppStateActions.SET_MAPS_API_RESPONSE: {
            const gmapsResponseAction = action as PayloadAction<GmapsApiResponse>
            return {...prevState, gmapsApiState: gmapsResponseAction.payload}
        }

        /**
         * Notification manager actions
         */

        case AppStateActions.SET_NOTIFICATIONS: {
            const notifications: Notification[] = (action as PayloadAction<Notification[]>).payload;
            return {...prevState, notifications: notifications};
        }

        case AppStateActions.ADD_NOTIFICATION: {
            const notification = (action as PayloadAction<Notification>).payload;
            return {...prevState, notifications: [...prevState.notifications, notification]};
        }

        case AppStateActions.CLEAR_NOTIFICATIONS: {
            return {...prevState, notifications: []}
        }

        /**
         * */

        default: {

            if (isActionPending(action)) {
                const metaAction = action as unknown as MetaAction;

                if (metaAction.meta?.arg.shouldPendingGlobally) {
                    return {...prevState, isRefreshing: true}
                }
            }

            if (isActionFulfilled(action)||isActionRejected(action)) {
                return  {...prevState, isRefreshing: false};
            }

            return prevState;
        }
    }
}

export default appStateReducer;
