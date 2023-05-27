import {Action} from "redux";
import {GmapsApiResponse} from "../../types/AppState";
import {PayloadAction} from "@reduxjs/toolkit";
import {Notification} from "../../types/AppState";

export enum AppStateActions {
    REFRESH_ON="REFRESH_ON",
    REFRESH_OFF="REFRESH_OFF",
    HEADER_MENU_TOGGLE="HEADER_MENU_TOGGLE",
    HEADER_MENU_CLOSE="HEADER_MENU_CLOSE",
    SET_NOTIFICATION="SET_NOTIFICATION",
    CLEAR_NOTIFICATION="CLEAR_NOTIFICATION",
    SET_MAPS_API_RESPONSE="SET_MAPS_API_RESPONSE"
}

export default AppStateActions;

export const switchAppState = (action: AppStateActions): Action<string> => {
    return {
        type: action.toString()
    }
}

export const setNotification = (notification: Notification): PayloadAction<Notification> => {
    return {
        type: AppStateActions.SET_NOTIFICATION,
        payload: notification
    }

}

export const setMapsApiResponse = (payload: GmapsApiResponse): PayloadAction<GmapsApiResponse> => {
    return {
        type: AppStateActions.SET_MAPS_API_RESPONSE,
        payload: payload
    }
}
