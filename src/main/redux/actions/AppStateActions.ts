import {Action} from "redux";

export enum AppStateActions {
    REFRESH_ON="REFRESH_ON",
    REFRESH_OFF="REFRESH_OFF",
    HEADER_MENU_TOGGLE="HEADER_MENU_TOGGLE",
    HEADER_MENU_CLOSE="HEADER_MENU_CLOSE",
    CLEAR_ERROR="CLEAR_ERROR"
}

export default AppStateActions;

export const getAppStateAction = (action: AppStateActions): Action<string> => {
    return {
        type: action.toString()
    }
}
