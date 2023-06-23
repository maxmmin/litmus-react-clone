import store, {AppDispatch} from "../../redux/store";
import {
    clearAuthRefreshTimer,
    setAuthRefreshTimer,
    setTimers,
    Timers
} from "../../redux/actions/TimersAction";
import {inject, injectable} from "inversify";
import IOC_TYPES from "../../inversify/IOC_TYPES";

@injectable()
class TimersStateManager {
    private readonly dispatch: AppDispatch = store.dispatch;
    private readonly getState: ()=>Timers = ()=>store.getState().timers!;

    constructor(@inject(IOC_TYPES.Store) private readonly _store: typeof store) {
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