import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import TimersActions, {Timers, TimersReducible} from "./TimersActions";
import AuthActions from "../auth/AuthActions";
import {setAuthRefreshingTimer} from "../../util/pureFunctions";

export const initState: TimersReducible = {
    authRefreshTimerId: null
};


const timersActionsReducer: Reducer<TimersReducible, PayloadAction<Timers>> = (prevState = initState, action) => {
    // check and clear timer before this.
    // ! one more check is placed inside handleError function
    if (action.type.indexOf(AuthActions.SET_AUTH)>-1) {
        if (prevState?.authRefreshTimerId) {
            clearTimeout(prevState.authRefreshTimerId)
        }
    }

    switch (action.type) {
        case TimersActions.SET_TIMERS: {
            return action.payload;
        }

        case `${AuthActions.SET_AUTH}/fulfilled`:
        case `${AuthActions.SET_AUTH}/rejected`: {
            return {...prevState, authRefreshTimerId: null}
        }


        default: {
            return prevState;
        }
    }
}

export default timersActionsReducer