import {Action} from "redux";
import {GmapsApiResponse} from "../../types/AppState";
import {PayloadAction} from "@reduxjs/toolkit";

export enum AppStateActions {
    REFRESH_ON="REFRESH_ON",
    REFRESH_OFF="REFRESH_OFF",
    HEADER_MENU_TOGGLE="HEADER_MENU_TOGGLE",
    HEADER_MENU_CLOSE="HEADER_MENU_CLOSE",
    CLEAR_ERROR="CLEAR_ERROR",
    SET_MAPS_API_RESPONSE="SET_MAPS_API_RESPONSE"
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
