import AppState, {
    AppStateReducible,
    GmapsApiResponse
} from "../types/applicationState/AppState";
import {Reducer} from "react";
import {Action} from "redux";
import AppStateAction from "../actions/AppStateAction";
import AuthAction from "../actions/AuthAction";
import {PayloadAction} from "@reduxjs/toolkit";
import Notification, {AppNotificationType, BasicNotification, notificationTypes} from "../types/applicationState/Notification";
import {isActionFulfilled, isActionPending, isActionRejected} from "../../util/pureFunctions";
import {FulfilledThunkAction, PendingThunkAction, PossiblePendingThunkAction, RejectedThunkAction} from "../store";
import ErrorResponse, {ApplicationError} from "../../rest/ErrorResponse";
import {BasicHttpError, HttpErrorParser} from "../../error/BasicHttpError";
import GeneralAction from "../GeneralAction";

const initialState: AppState = {isRefreshing: false, isHeaderMenuOpened: false, gmapsApiState: null, notifications: []}



const appStateReducer: Reducer<AppStateReducible, Action<String>> = (prevState = initialState, action) => {

    switch (action.type) {
        case AppStateAction.REFRESH_ON: {
            return {...prevState, isRefreshing: true}
        }

        case AppStateAction.REFRESH_OFF: {
            return { ...prevState, isRefreshing: false}
        }

        case AppStateAction.HEADER_MENU_TOGGLE: {
            return {...prevState, isHeaderMenuOpened: !prevState!.isHeaderMenuOpened}
        }

        case AppStateAction.HEADER_MENU_CLOSE: {
            return {...prevState, isHeaderMenuOpened: false}
        }


        case GeneralAction.RESET_DATA: {
            return {...initialState, notifications: prevState.notifications, gmapsApiState: prevState.gmapsApiState}
        }

        case AppStateAction.SET_MAPS_API_RESPONSE: {
            const gmapsResponseAction = action as PayloadAction<GmapsApiResponse>
            return {...prevState, gmapsApiState: gmapsResponseAction.payload}
        }

        /**
         * Notification manager actions
         */

        case AppStateAction.SET_NOTIFICATIONS: {
            const notifications: Notification[] = (action as PayloadAction<Notification[]>).payload;
            return {...prevState, notifications: notifications};
        }

        case AppStateAction.ADD_NOTIFICATION: {
            const notification = (action as PayloadAction<Notification>).payload;
            return {...prevState, notifications: [...prevState.notifications, notification]};
        }

        case AppStateAction.CLEAR_NOTIFICATIONS: {
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
                    if (errorAction.meta.notify) {
                        const err: object = errorAction.payload;

                        let errorResponse: ApplicationError<any>;

                        errorResponse = HttpErrorParser.parseError(err);

                        const basicHttpErr = new BasicHttpError(errorResponse)

                        const notification = {...new BasicNotification('ERROR', basicHttpErr.getDescription())};
                        state.notifications = [...state.notifications, notification];
                    }
                }

                return state;
            }

            else return prevState;
        }
    }
}

export default appStateReducer;
