import {Action} from "redux";
import {GmapsApiResponse} from "./AppState";
import {PayloadAction} from "@reduxjs/toolkit";
import Notification from "./Notification";

enum AppStateActions {
    REFRESH_ON="REFRESH_ON",
    REFRESH_OFF="REFRESH_OFF",
    HEADER_MENU_TOGGLE="HEADER_MENU_TOGGLE",
    HEADER_MENU_CLOSE="HEADER_MENU_CLOSE",
    SET_MAPS_API_RESPONSE="SET_MAPS_API_RESPONSE",
    /**
     * NOTIFICATIONS
     */
    SET_NOTIFICATIONS="UPDATE_NOTIFICATIONS",
    ADD_NOTIFICATION="ADD_NOTIFICATION",
    CLEAR_NOTIFICATIONS="CLEAR_NOTIFICATIONS"
}

export default AppStateActions;

export const switchAppState = (action: AppStateActions): Action<string> => {
    return {
        type: action.toString()
    }
}

export const setMapsApiResponse = (payload: GmapsApiResponse): PayloadAction<GmapsApiResponse> => {
    return {
        type: AppStateActions.SET_MAPS_API_RESPONSE,
        payload: payload
    }
}

export const setNotifications = (notifications: Notification[]): PayloadAction<Notification[]> => {
    return {
        type: AppStateActions.SET_NOTIFICATIONS,
        payload: notifications
    }
}

export const addNotification = (notification: Notification): PayloadAction<Notification> => {
    return {
        type: AppStateActions.ADD_NOTIFICATION,
        payload: notification
    }
}

export const clearNotifications = (): Action => {
    return {
        type: AppStateActions.CLEAR_NOTIFICATIONS
    }
}