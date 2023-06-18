import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import TimersAction, {Timers, TimersReducible} from "../actions/TimersAction";
import AuthAction from "../actions/AuthAction";

export const initState: TimersReducible = {
    authRefreshTimerId: null
};


const timersActionsReducer: Reducer<TimersReducible, PayloadAction<Timers>> = (prevState = initState, action) => {
    // check and clear timer before this.
    // ! one more check is placed inside handleError function
    if (action.type.indexOf(AuthAction.AUTHENTICATE)>-1) {
        if (prevState?.authRefreshTimerId) {
            clearTimeout(prevState.authRefreshTimerId)
        }
    }

    switch (action.type) {
        case TimersAction.SET_TIMERS: {
            return action.payload;
        }

        case TimersAction.SET_AUTH_REFRESH_TIMER: {
            const timerId = action.payload as unknown as NodeJS.Timer|null;
            return {...prevState, authRefreshTimerId: timerId}
        }

        case `${AuthAction.AUTHENTICATE}/fulfilled`:
        case `${AuthAction.AUTHENTICATE}/rejected`: {
            return {...prevState, authRefreshTimerId: null}
        }


        default: {
            return prevState;
        }
    }
}

export default timersActionsReducer