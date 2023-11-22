import store from "../../redux/store";
import {Action} from "redux";
import AppStateAction from "../../redux/actions/AppStateAction";
import ApplicationStateManager from "./ApplicationStateManager";
import {checkNotEmpty} from "../../util/pureFunctions";

class ApplicationStateManagerImpl implements ApplicationStateManager{
    private readonly _store: typeof store = store;

    enablePending (): void {
        const action: Action<AppStateAction> = {
            type: AppStateAction.REFRESH_ON
        }
        this._store.dispatch(action)
    }

    isMenuOpened(): boolean {
        return checkNotEmpty(store.getState().appState?.isHeaderMenuOpened);
    }

    isPending(): boolean {
        return checkNotEmpty(store.getState().appState?.isRefreshing);
    }

    disableSecuredImgHandling(): void {
        const action: Action<AppStateAction> = {
            type: AppStateAction.SECURED_IMG_HANDLING_OFF
        }

        this._store.dispatch(action);
    }

    enableSecuredImgHandling(): void {
        const action: Action<AppStateAction> = {
            type: AppStateAction.SECURED_IMG_HANDLING_ON
        }

        this._store.dispatch(action);
    }

    isSecuredImgHandling(): boolean {
        return this._store.getState().appState!.securedImgHandling;
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