import {PayloadAction} from "@reduxjs/toolkit";

enum TimersAction {
    SET_TIMERS="SET_TIMERS",
    SET_AUTH_REFRESH_TIMER="SET_AUTH_REFRESH_TIMER"
}

export default TimersAction;

export type Timers = {
    authRefreshTimerId: NodeJS.Timer | null
}

export type TimersReducible = Timers | undefined

export const setTimers = (timers: Timers): PayloadAction<Timers> => {
    return {
        type: TimersAction.SET_TIMERS,
        payload: timers
    }
}

export const setAuthRefreshTimer = (timerId: NodeJS.Timer|null): PayloadAction<NodeJS.Timer|null> => {
    return {
        type: TimersAction.SET_AUTH_REFRESH_TIMER,
        payload: timerId
    }
}

export const clearAuthRefreshTimer = (): PayloadAction<Partial<Timers>> => {
    console.log("auth callback cleared")
    return {
        type: TimersAction.SET_TIMERS,
        payload: {
            authRefreshTimerId: null
        }
    }
}


