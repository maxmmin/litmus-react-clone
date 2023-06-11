import AuthenticationManager from "./AuthenticationManager";
import store from "../../redux/store";
import {BasicNotificationManager, NotificationManager} from "../../redux/applicationState/Notification";
import AuthService, {Credentials} from "./AuthService";
import ErrorResponse from "../../util/apiRequest/ErrorResponse";
import {BasicHttpError, getErrMessage} from "../../util/apiRequest/BasicHttpError";
import {PayloadAction} from "@reduxjs/toolkit";
import LoginPageDataActions, {LoginPageState} from "../../redux/login/LoginPageDataActions";
import Authentication, {AuthenticationReducible} from "../../redux/auth/Authentication";
import AuthActions, {clearAuthentication} from "../../redux/auth/AuthActions";
import deepCopy, {isValid} from "../../util/pureFunctions";
import jwtDecode, {JwtPayload} from "jwt-decode";
import ApplicationStateManager from "../appState/ApplicationStateManager";
import TimersStateManager from "../timers/TimersStateManager";
import ApiRequestManager, {HttpMethod} from "../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../util/apiRequest/BasicApiRequestManager";
import appConfig from "../../config/appConfig";
import {Action} from "redux";
import BasicAuthService from "./BasicAuthService";

class BasicAuthenticationManager implements AuthenticationManager {
    private readonly _store: typeof store;
    private readonly notificationManager: NotificationManager;
    private readonly appStateManager: ApplicationStateManager;
    private readonly timersStateManager: TimersStateManager;
    private readonly authService: AuthService;

    constructor(_store: typeof store, notificationManager: NotificationManager, authService: AuthService, appStateManager: ApplicationStateManager, timersStateManager: TimersStateManager) {
        this._store = _store;
        this.notificationManager = notificationManager;
        this.authService = authService;
        this.appStateManager = appStateManager;
        this.timersStateManager = timersStateManager;
    }

    async login(): Promise<void> {
        const {email, password}: Credentials = this._store.getState().loginPageState!;
        this.appStateManager.enablePending();

        const authentication: Authentication | null  = await this.authService.getAuth({email, password})
            .catch(errorResponse => {
                const msg = getErrMessage(errorResponse) || 'Невідома помилка'
                this.notificationManager.error(msg)
                this.setLoginError(errorResponse);
                return null;
            })

        if (authentication) {
            this.setAuth(authentication);
        }

        this.appStateManager.disablePending();

    }

    async checkAndRefreshAuth(): Promise<void> {

        const auth = this.getAuth();

        if (auth) {
            try {
                if (this.isInvalid(auth.accessToken)||auth.expired) {
                    if (this.isValid(auth.refreshToken)) {
                        await this.refreshAuth();
                    } else {
                        this.logout();
                    }
                }

                if (!this.timersStateManager.getAuthRefreshTimer()) {
                    this.planAuthRefresh();
                }
            }

            catch (e: any) {
                const errMsg: string = getErrMessage(e)||'Невідома помилка. Авторизуйтесь, будь ласка, заново';

                this.notificationManager.error(errMsg);
                this.logout();
            }
        }
        else {
            if (this.timersStateManager.getAuthRefreshTimer()) {
                this.clearAuthRefreshTimer();
            }
        }
    }

    logout(): void {
        this._store.dispatch(clearAuthentication())
    }

    async refreshAuth(): Promise<void> {
        const auth = this.getAuth();

            if (!auth) throw new BasicHttpError(401,"trying to refresh auth while prev auth was null")

            const refreshToken = auth.refreshToken;

            if (!isValid(refreshToken)) {
                throw new BasicHttpError(401, "Час дії refresh токену вичерпано. Будь ласка, автентифікуйтесь заново")
            }

            const requestManager: ApiRequestManager = new BasicApiRequestManager();

            const response: Response = await requestManager
                .url(appConfig.serverMappings.refreshTokens)
                .body(JSON.stringify({refreshToken: refreshToken}))
                .method(HttpMethod.POST)
                .fetch();

            console.log(response.json());

            if (response.ok) {
                const auth: Authentication = await response.json() as Authentication;
                this.setAuth(auth)
            } else {
                let error: ErrorResponse<any>|null = await BasicHttpError.getHttpErrorFromResponse(response);
                if (!error) {
                    error = new BasicHttpError(401, "Помилка автентифікації. Авторизуйтесь, будь ласка, заново")
                }
                throw error;
            }

    }

    private setExpired () {
        const action: Action<AuthActions> = {type: AuthActions.SET_EXPIRED}
        this._store.dispatch(action);
    }

    private setAuth (auth: Authentication) {
        auth.expired = false;
        const action: PayloadAction<Authentication> = {
            type: AuthActions.SET_AUTH,
            payload: auth
        }
        this._store.dispatch(action)
    }

    private getAuth(): AuthenticationReducible {
        return this._store.getState().authentication;
    }

    private setLoginError (error: ErrorResponse<any>) {
        const action: PayloadAction<Partial<LoginPageState>> = {type: LoginPageDataActions.UPDATE_STATE, payload: {error: deepCopy(error)}}
        this._store.dispatch(action)
    }

    private isValid (token: string | null | undefined): boolean {
        try {
            if (token) {
                return !(jwtDecode<JwtPayload>(token).exp!*1000<Date.now());
            }
        } catch (e) {
            console.error(e)
        }
        return false;
    }

    private isInvalid (token: string | null | undefined): boolean {
        return !isValid(token);
    }

    private clearAuthRefreshTimer () {
        const timerId = this.timersStateManager.getAuthRefreshTimer();
        if (timerId) {
            window.clearTimeout(timerId);
            this.timersStateManager.setAuthRefreshTimer(null);
        } else {
            throw new Error("auth timer is not set")
        }
    }

    private planAuthRefresh (): void {
        const authentication = this.getAuth()!;

        const accessToken = authentication.accessToken;

        let expirationTimeInMs;

        try {
            expirationTimeInMs = jwtDecode<JwtPayload>(accessToken).exp! * 1000;
        } catch (e) {
            console.error(e)
            throw new Error("Error occurred while parsing jwt token")
        }

        const refreshCallbackDelayInMs = expirationTimeInMs - Date.now() - 1000*60;

        const expDate = new Date(expirationTimeInMs-1000*60);

        console.log(`auth update planned in ${expDate.getHours()}:${expDate.getMinutes()}:${expDate.getSeconds()}`)

        // this callback will fire when it will 1 minute before jwt expiring
        const timer = setTimeout(()=>{
            console.log("updating auth")
            this.refreshAuth()
        }, refreshCallbackDelayInMs)

        this.timersStateManager.setAuthRefreshTimer(timer)
    }

    isAuthActual(): boolean {
        const auth = this.getAuth();
        if (auth) {
            return !auth.expired&&this.isValid(auth.refreshToken);
        } else return false;
    }

    static getBasicManager (_store: typeof store) {
        const notificationManager = new BasicNotificationManager(_store.dispatch);
        const authService = new BasicAuthService();
        const appStateManager = new ApplicationStateManager(_store);
        const timersStateManager = new TimersStateManager(_store);
        return new BasicAuthenticationManager(_store, notificationManager, authService, appStateManager, timersStateManager);
    }
}

export default BasicAuthenticationManager;