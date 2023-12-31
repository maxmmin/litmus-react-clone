import AppState, {
    AppStateReducible
} from "../types/applicationState/AppState";
import {Reducer} from "react";
import {Action} from "redux";
import AppStateAction from "../actions/AppStateAction";
import {PayloadAction} from "@reduxjs/toolkit";
import Notification, {AppNotificationType, BasicNotification} from "../types/applicationState/Notification";
import {isActionFulfilled, isActionPending, isActionRejected} from "../../util/pureFunctions";
import {FulfilledThunkAction, PossiblePendingThunkAction, RejectedThunkAction} from "../store";
import {ApplicationError} from "../../rest/ErrorResponse";
import {BasicHttpError, HttpErrorParser} from "../../error/BasicHttpError";

export const initialAppState: AppState = {pendingActions: 0, isHeaderMenuOpened: false, notifications: [], securedImgHandling: false}



const applicationGlobalStateReducer: Reducer<AppStateReducible, Action<String>> = (prevState = initialAppState, action) => {

    switch (action.type) {
        case AppStateAction.REFRESH_ON: {
            return {...prevState, pendingActions: prevState.pendingActions+1}
        }

        case AppStateAction.REFRESH_OFF: {
            const newPendingActionsCount = prevState.pendingActions-1;
            if (newPendingActionsCount < 0) throw new Error("invalid pending actions count")
            return { ...prevState, pendingActions: newPendingActionsCount}
        }

        case AppStateAction.HEADER_MENU_TOGGLE: {
            return {...prevState, isHeaderMenuOpened: !prevState!.isHeaderMenuOpened}
        }

        case AppStateAction.HEADER_MENU_CLOSE: {
            return {...prevState, isHeaderMenuOpened: false}
        }

        case AppStateAction.SECURED_IMG_HANDLING_OFF: {
            return {...prevState, securedImgHandling: false}
        }

        case AppStateAction.SECURED_IMG_HANDLING_ON: {
            return {...prevState, securedImgHandling: true}
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
                    return  {...prevState, pendingActions: prevState.pendingActions+1}
            }

            else if (isActionFulfilled(action)||isActionRejected(action)) {
                let state = prevState;

                if (metaAction.meta?.arg.globalPending) {
                    state = {...prevState, pendingActions: prevState.pendingActions-1};
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

                        let errorResponse: ApplicationError = HttpErrorParser.parseError(err);

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

export default applicationGlobalStateReducer;
