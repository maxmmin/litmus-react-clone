import store from "../../redux/store";
import {setAuthRefreshTimer, setTimers, Timers, TimersReducible} from "../../redux/timers/TimersActions";

class TimersStateManager {
    private _store: typeof store;


    constructor(_store: typeof store) {
        this._store = _store;
    }

    getTimers(): Timers {
        return this._store.getState().timers!;
    }

    setTimers (timers: Timers): void {
        this._store.dispatch(setTimers(timers));
    }

    setAuthRefreshTimer(timerId: NodeJS.Timer|null): void {
        this._store.dispatch(setAuthRefreshTimer(timerId))
    }

    getAuthRefreshTimer(): NodeJS.Timer|null|undefined {
        return this.getTimers().authRefreshTimerId;
    }
}

export default TimersStateManager;