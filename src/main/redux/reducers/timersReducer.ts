import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import TimersActions, {Timers, TimersReducible} from "../actions/TimersActions";
import AuthActions from "../actions/AuthActions";
import {setAuthRefreshingTimer} from "../../data/pureFunctions";

export const initState: TimersReducible = {
    authRefreshTimerId: null
};


const timersActionsReducer: Reducer<TimersReducible, PayloadAction<Timers>> = (prevState = initState, action) => {
    // check and clear timer before this.
    // ! one more check is placed inside handleError function
    if (action.type.indexOf(AuthActions.REFRESH_AUTH)>-1) {
        if (prevState?.authRefreshTimerId) {
            clearTimeout(prevState.authRefreshTimerId)
        }
    }

    switch (action.type) {
        case TimersActions.SET_TIMERS: {
            return {...prevState, ...action.payload}
        }


        default: {
            return prevState;
        }
    }
}

export default timersActionsReducer