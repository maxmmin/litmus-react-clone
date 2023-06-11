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
import BasicAuthService from "./BasicAuthService";
import {HttpStatus} from "../../util/apiRequest/HttpStatus";

class BasicAuthenticationManager implements AuthenticationManager {
    private readonly _store: typeof store;
    private readonly notificationManager: NotificationManager;
    private readonly appStateManager: ApplicationStateManager;
    private readonly timersStateManager: TimersStateManager;
    private readonly authService: AuthService;

    private static pending: boolean = false;

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
                if (errorResponse instanceof BasicHttpError&&errorResponse.status===HttpStatus.UNAUTHENTICATED) {
                    errorResponse = new BasicHttpError(HttpStatus.UNAUTHENTICATED, "Перевірте правильність введених данних")
                }
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
                if (this.isAuthExpired()&&!BasicAuthenticationManager.pending) {
                    if (this.isValid(auth.refreshToken)) {
                        try {
                            await this.refreshAuth();
                        }

                        catch (e: any) {

                        }

                        finally {
                            BasicAuthenticationManager.turnPendingOff();
                        }
                    } else {
                        this.logout();
                    }
                }

                if (!this.timersStateManager.getAuthRefreshTimer()) {
                    this.planAuthRefresh();
                }
        }
        else {
            if (this.timersStateManager.getAuthRefreshTimer()) {
                this.clearAuthRefreshTimer();
            }
        }
    }

    logout(): void {
        this._store.dispatch(clearAuthentication());
        const timer = this.timersStateManager.getAuthRefreshTimer();
        if (timer) {
            window.clearTimeout(timer);
            this.timersStateManager.setAuthRefreshTimer(null);
        }
    }

    async refreshAuth(): Promise<void> {
        if (!Boolean(0)) {
            throw new Error("supper err; can u handle me")
        }
        BasicAuthenticationManager.turnPendingOn();

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

    private isValid (token: string): boolean {
        try {
            if (token) {
                return jwtDecode<JwtPayload>(token).exp!*1000>Date.now();
            }
        } catch (e) {
            console.error(e)
        }
        return false;
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
            this.refreshAuth().catch(this.handleAuthRefreshErr.bind(this))
        }, refreshCallbackDelayInMs)

        this.timersStateManager.setAuthRefreshTimer(timer)
    }

    isAuthActual(): boolean {
        const auth = this.getAuth();
        if (auth) {
            return !auth.expired&&this.isValid(auth.refreshToken);
        } else return false;
    }

    isAuthExpired(): boolean {
        return !this.isAuthActual();
    }

    static getBasicManager (_store: typeof store) {
        const notificationManager = new BasicNotificationManager(_store.dispatch);
        const authService = new BasicAuthService();
        const appStateManager = new ApplicationStateManager(_store);
        const timersStateManager = new TimersStateManager(_store);
        return new BasicAuthenticationManager(_store, notificationManager, authService, appStateManager, timersStateManager);
    }

    private static turnPendingOn () {
        BasicAuthenticationManager.pending = true;
    }

    private static turnPendingOff () {
        BasicAuthenticationManager.pending = false;
    }

    private handleAuthRefreshErr(e: any): void {
        const errMsg: string = getErrMessage(e)||'Невідома помилка. Авторизуйтесь, будь ласка, заново';
        console.error(e);
        this.notificationManager.error(errMsg);
        this.logout();
    }
}

export default BasicAuthenticationManager;