import store from "../../redux/store";
import {Action} from "redux";
import AppStateActions from "../../redux/applicationState/AppStateActions";

class ApplicationStateManager {
    private readonly _store: typeof store;

    constructor(_store: typeof store) {
        this._store = _store;
    }

    enablePending (): void {
        const action: Action<AppStateActions> = {
            type: AppStateActions.REFRESH_ON
        }
        this._store.dispatch(action)
    }

    disablePending (): void {
        const action: Action<AppStateActions> = {
            type: AppStateActions.REFRESH_OFF
        }
        this._store.dispatch(action)
    }

    headerMenuToggle (): void {
        const action: Action<AppStateActions> = {
            type: AppStateActions.HEADER_MENU_TOGGLE
        }
        this._store.dispatch(action)
    }

    headerMenuClose (): void {
        const action: Action<AppStateActions> = {
            type: AppStateActions.HEADER_MENU_CLOSE
        }
        this._store.dispatch(action)
    }
}

export default ApplicationStateManager;