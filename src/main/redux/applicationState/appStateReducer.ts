import AppState, {
    AppStateReducible,
    GmapsApiResponse
} from "./AppState";
import {Reducer} from "react";
import {Action} from "redux";
import AppStateActions from "./AppStateActions";
import AuthActions from "../auth/AuthActions";
import {PayloadAction} from "@reduxjs/toolkit";
import Notification, {AppNotificationType, BasicNotification, notificationTypes} from "./Notification";
import {isActionFulfilled, isActionPending, isActionRejected} from "../../util/pureFunctions";
import {FulfilledThunkAction, PendingThunkAction, PossiblePendingThunkAction, RejectedThunkAction} from "../store";
import ErrorResponse from "../../util/apiRequest/ErrorResponse";
import {BasicHttpError} from "../../util/apiRequest/BasicHttpError";

const initialState: AppState = {isRefreshing: false, isHeaderMenuOpened: false, gmapsApiState: null, notifications: []}



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
            return {...initialState, notifications: prevState.notifications, gmapsApiState: prevState.gmapsApiState}
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
            // core meta
            const metaAction = action as PossiblePendingThunkAction;

            if (isActionPending(action)&&metaAction?.meta?.arg.globalPending) {
                    return  {...prevState, isRefreshing: true}
            }

            else if (isActionFulfilled(action)||isActionRejected(action)) {
                let state = prevState;

                if (prevState.isRefreshing&&metaAction.meta?.arg.globalPending) {
                    state = {...prevState, isRefreshing: false};
                }

                if (isActionFulfilled(action)) {
                    const fulfilledAction: FulfilledThunkAction = action as FulfilledThunkAction;
                    if (fulfilledAction.meta.notify) {
                        state = {...state}
                        const msg = fulfilledAction.meta.successMessage?fulfilledAction.meta.successMessage:`Action ${action.type} was executed successfully`;
                        const duration =  fulfilledAction.meta.duration;
                        const type: AppNotificationType = fulfilledAction.meta.notificationType?fulfilledAction.meta.notificationType:'SUCCESS';
                        const notification = {...new BasicNotification(type, msg, duration)};
                        state.notifications = [...state.notifications, notification]
                    }
                } else {
                    state = {...state}
                    const errorAction: RejectedThunkAction = action as RejectedThunkAction;
                    const err: object = errorAction.payload;

                    let errorResponse: ErrorResponse<any>;

                    if (err && "status" in err && "detail" in err) {
                        errorResponse = err as ErrorResponse<any>;
                    } else {
                        errorResponse = BasicHttpError.parseError(err);
                    }

                    const basicHttpErr = new BasicHttpError(errorResponse)

                    const notification = {...new BasicNotification('ERROR', basicHttpErr.getDescription())};
                    state.notifications = [...state.notifications, notification];
                }

                return state;
            }

            else return prevState;
        }
    }
}

export default appStateReducer;
