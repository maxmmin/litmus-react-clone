import {Action} from "redux";
import {GmapsApiResponse} from "../types/applicationState/AppState";
import {PayloadAction} from "@reduxjs/toolkit";
import Notification from "../types/applicationState/Notification";

enum AppStateAction {
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

export default AppStateAction;

export const switchAppState = (action: AppStateAction): Action<string> => {
    return {
        type: action.toString()
    }
}

export const setMapsApiResponse = (payload: GmapsApiResponse): PayloadAction<GmapsApiResponse> => {
    return {
        type: AppStateAction.SET_MAPS_API_RESPONSE,
        payload: payload
    }
}

export const setNotifications = (notifications: Notification[]): PayloadAction<Notification[]> => {
    return {
        type: AppStateAction.SET_NOTIFICATIONS,
        payload: notifications
    }
}

export const addNotification = (notification: Notification): PayloadAction<Notification> => {
    return {
        type: AppStateAction.ADD_NOTIFICATION,
        payload: notification
    }
}

export const clearNotifications = (): Action => {
    return {
        type: AppStateAction.CLEAR_NOTIFICATIONS
    }
}