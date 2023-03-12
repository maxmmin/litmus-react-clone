import {PayloadAction} from "@reduxjs/toolkit";

enum TimersActions {
    SET_TIMERS="SET_TIMERS"
}

export default TimersActions;

export type Timers = {
    authRefreshTimerId: NodeJS.Timer | null
}

export type TimersReducible = Timers | undefined

export const setTimers = (timers :Partial<Timers>): PayloadAction<Partial<Timers>> => {
    return {
        type: TimersActions.SET_TIMERS,
        payload: timers
    }
}

export const clearAuthRefreshTimer = (): PayloadAction<Partial<Timers>> => {
    console.log("auth callback cleared")
    return {
        type: TimersActions.SET_TIMERS,
        payload: {
            authRefreshTimerId: null
        }
    }
}


