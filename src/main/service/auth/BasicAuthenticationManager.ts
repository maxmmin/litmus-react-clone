import AuthenticationManager from "./AuthenticationManager";
import store from "../../redux/store";
import {NotificationManager} from "../../redux/applicationState/Notification";
import AuthService, {Credentials} from "./AuthService";
import errorResponse from "../../util/apiRequest/ErrorResponse";
import {BasicHttpError} from "../../util/apiRequest/BasicHttpError";
import ErrorResponse from "../../util/apiRequest/ErrorResponse";
import {PayloadAction} from "@reduxjs/toolkit";
import LoginPageDataActions, {LoginPageState} from "../../redux/login/LoginPageDataActions";
import Authentication from "../../redux/auth/Authentication";
import AuthActions from "../../redux/auth/AuthActions";
import {isValid} from "../../util/pureFunctions";

class BasicAuthenticationManager implements AuthenticationManager {
    private _store: typeof store;
    private notificationManager: NotificationManager;
    private authService: AuthService;

    constructor(_store: typeof store, notificationManager: NotificationManager, authService: AuthService) {
        this._store = _store;
        this.notificationManager = notificationManager;
        this.authService = authService;
    }

    async login(): Promise<void> {
        const {email, password}: Credentials = this._store.getState().loginPageState!;
        const authentication: Authentication | null  = await this.authService.getAuth({email, password})
            .catch(errorResponse => {
                this.notificationManager.error(errorResponse)
                this.setLoginError(errorResponse);
                return null;
            })
        if (authentication) {
            this.setAuth(authentication);
        }
    }

    checkAndRefreshAuth(): void {
        isValid()
    }

    logout(): void {
    }

    refreshAuth(): void {
    }

    private setAuth (auth: Authentication) {
        auth.isExpired = false;
        const action: PayloadAction<Authentication> = {
            type: AuthActions.SET_AUTH,
            payload: auth
        }
        this._store.dispatch(action)
    }

    private setLoginError (error: ErrorResponse<any>) {
        const action: PayloadAction<Partial<LoginPageState>> = {type: LoginPageDataActions.UPDATE_STATE, payload: {error}}
        this._store.dispatch(action)
    }
}