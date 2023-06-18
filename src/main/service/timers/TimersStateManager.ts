import store, {AppDispatch} from "../../redux/store";
import {
    clearAuthRefreshTimer,
    setAuthRefreshTimer,
    setTimers,
    Timers
} from "../../redux/actions/TimersAction";

class TimersStateManager {
    private readonly dispatch: AppDispatch;
    private readonly getState: ()=>Timers;


    constructor(dispatch: AppDispatch, getState: ()=>Timers) {
        this.dispatch = dispatch;
        this.getState = getState;
    }

    static getManager(_store: typeof store = store): TimersStateManager {
        return new TimersStateManager(_store.dispatch, ()=>_store.getState().timers!)
}

    getTimers(): Timers {
        return this.getState();
    }

    setTimers (timers: Timers): void {
        this.dispatch(setTimers(timers));
    }

    setAuthRefreshTimer(timerId: NodeJS.Timer|null): void {
        this.dispatch(setAuthRefreshTimer(timerId))
    }

    getAuthRefreshTimer(): NodeJS.Timer|null|undefined {
        return this.getTimers().authRefreshTimerId;
    }

    clearAuthRefreshTimer(): void {
        this.dispatch(clearAuthRefreshTimer());
    }
}

export default TimersStateManager;