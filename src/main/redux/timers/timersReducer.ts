import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import TimersActions, {Timers, TimersReducible} from "./TimersActions";
import AuthActions from "../auth/AuthActions";

export const initState: TimersReducible = {
    authRefreshTimerId: null
};


const timersActionsReducer: Reducer<TimersReducible, PayloadAction<Timers>> = (prevState = initState, action) => {
    // check and clear timer before this.
    // ! one more check is placed inside handleError function
    if (action.type.indexOf(AuthActions.AUTHENTICATE)>-1) {
        if (prevState?.authRefreshTimerId) {
            clearTimeout(prevState.authRefreshTimerId)
        }
    }

    switch (action.type) {
        case TimersActions.SET_TIMERS: {
            return action.payload;
        }

        case TimersActions.SET_AUTH_REFRESH_TIMER: {
            const timerId = action.payload as unknown as NodeJS.Timer|null;
            return {...prevState, authRefreshTimerId: timerId}
        }

        case `${AuthActions.AUTHENTICATE}/fulfilled`:
        case `${AuthActions.AUTHENTICATE}/rejected`: {
            return {...prevState, authRefreshTimerId: null}
        }


        default: {
            return prevState;
        }
    }
}

export default timersActionsReducer