import store from "../../redux/store";
import {Action} from "redux";
import AppStateAction from "../../redux/actions/AppStateAction";
import ApplicationStateManager from "./ApplicationStateManager";

class ApplicationStateManagerImpl implements ApplicationStateManager{
    private readonly _store: typeof store = store;

    enablePending (): void {
        const action: Action<AppStateAction> = {
            type: AppStateAction.REFRESH_ON
        }
        this._store.dispatch(action)
    }

    disablePending (): void {
        const action: Action<AppStateAction> = {
            type: AppStateAction.REFRESH_OFF
        }
        this._store.dispatch(action)
    }

    headerMenuToggle (): void {
        const action: Action<AppStateAction> = {
            type: AppStateAction.HEADER_MENU_TOGGLE
        }
        this._store.dispatch(action)
    }

    headerMenuClose (): void {
        const action: Action<AppStateAction> = {
            type: AppStateAction.HEADER_MENU_CLOSE
        }
        this._store.dispatch(action)
    }

}

export default ApplicationStateManagerImpl;