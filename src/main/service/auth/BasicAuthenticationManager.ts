import AuthenticationManager from "./AuthenticationManager";
import store, {LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import AuthService, {Credentials} from "./AuthService";
import {BasicHttpError} from "../../util/apiRequest/BasicHttpError";
import Authentication, {AuthenticationReducible} from "../../redux/auth/Authentication";
import deepCopy, {checkNotEmpty, isValid} from "../../util/pureFunctions";
import jwtDecode, {JwtPayload} from "jwt-decode";
import TimersStateManager from "../timers/TimersStateManager";
import BasicAuthService from "./BasicAuthService";
import {HttpStatus} from "../../util/apiRequest/HttpStatus";
import AuthenticationStateManager from "./AuthenticationStateManager";
import {createAsyncThunk} from "@reduxjs/toolkit";
import AuthActions from "../../redux/auth/AuthActions";
import {BasicNotificationManager, NotificationManager} from "../../redux/applicationState/Notification";

class BasicAuthenticationManager implements AuthenticationManager {
    private readonly authenticationStateManager: AuthenticationStateManager;
    private readonly timersStateManager: TimersStateManager;
    private readonly authService: AuthService;
    private readonly notificationManager: NotificationManager;

    private static locked: boolean = false;

    constructor(authStateManager: AuthenticationStateManager, authService: AuthService, timersStateManager: TimersStateManager, notificationManager: NotificationManager) {
        this.authenticationStateManager = authStateManager;
        this.authService = authService;
        this.timersStateManager = timersStateManager;
        this.notificationManager = notificationManager;
    }

    login({email, password}: Credentials): void {
        const arg: ThunkArg<Credentials> = {email, password, globalPending: true}
        BasicAuthenticationManager.lock();
        this.authenticationStateManager.retrieveAuthentication(this._loginThunk(arg))
            .finally(()=>{BasicAuthenticationManager.unLock()})
    }

    _login({email, password}: Credentials): Promise<Authentication> {
        return this.authService.getAuth({email, password});
}

    _loginThunk = createAsyncThunk<Authentication, Credentials, LitmusAsyncThunkConfig>(AuthActions.AUTHENTICATE, async (credentials, {rejectWithValue, fulfillWithValue }) => {

        try {
            const authentication: Authentication  = await this._login(credentials)
            return fulfillWithValue(authentication, {notify: true, successMessage: "Вхід в акаунт успішно виконано"});
        }
        catch (thrownErr: any) {
            if ("status" in thrownErr&&"detail" in thrownErr&&thrownErr.status===HttpStatus.UNAUTHENTICATED) {
                thrownErr = new BasicHttpError({status: HttpStatus.UNAUTHENTICATED, title: "Невірні облікові дані", detail: null})
            }
            return rejectWithValue(deepCopy(thrownErr));
        }}

     )
    // @todo 12.10
    // now if method checkAndRefreshAuth wont be invoked no more u will stay in ui even there is 401 error. Need to write global custom error handler

    checkAndRefreshAuth(): void {

        const auth = this.authenticationStateManager.getAuth();

        if (auth) {
                console.log(auth)
                if (this.isAuthExpired()&&!BasicAuthenticationManager.locked) {
                    if (!this.isTokenExpired(auth.refreshToken)) {
                        this.refreshAuth();
                    } else {
                        this.notificationManager.error("Недійсні автентифікаційні дані. Увійдіть, будь ласка, заново.");
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

    refreshAuth(): void {
        const auth = checkNotEmpty(this.authenticationStateManager.getAuth());
        const meta: ThunkArg<Authentication> = {globalPending: false, ...auth};

        const authThunk = this._refreshAuthThunk(meta);

        BasicAuthenticationManager.lock();
        this.authenticationStateManager
            .retrieveAuthentication(authThunk)
            .finally(()=>BasicAuthenticationManager.unLock());
    }
    
    private async _refreshAuth(auth: AuthenticationReducible): Promise<Authentication> {
        if (!auth) throw new BasicHttpError({status: 401, title: "trying to refresh auth while prev auth was null}", detail: null});

        const refreshToken = auth.refreshToken;

        if (!isValid(refreshToken)) {
            throw new BasicHttpError({status: 401, title: "Час дії refresh токену вичерпано. Будь ласка, автентифікуйтесь заново", detail: null});
        }

        return  await this.authService.refreshAuth(refreshToken);
    }

    private _refreshAuthThunk = createAsyncThunk<Authentication, ThunkArg<AuthenticationReducible>, LitmusAsyncThunkConfig>(AuthActions.AUTHENTICATE, async (arg,{rejectWithValue, fulfillWithValue})=>{
            try {
                return fulfillWithValue(await this._refreshAuth(arg), {notify: false});
            }
            catch (e: any) {
                return rejectWithValue(deepCopy(e))
            }

        }
    );

    private isTokenExpired (token: string): boolean {
        try {
            if (token) {
                return jwtDecode<JwtPayload>(token).exp!*1000<Date.now();
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
        const authentication = this.authenticationStateManager.getAuth()!;

        const accessToken = authentication.accessToken;

        let expirationTimeInMs;

        try {
            expirationTimeInMs = jwtDecode<JwtPayload>(accessToken).exp! * 1000;
        } catch (e) {
            console.error(e)
            throw new Error("Error occurred while parsing jwt token")
        }

        // Time diff between token expiration and application token refresh(i update it earlier to prevent errors)
        const difference = 1000*30;

        const refreshCallbackDelayInMs = expirationTimeInMs - Date.now() - difference;

        console.log(`auth update planned in ${new Date(expirationTimeInMs-difference).toLocaleTimeString()}`)

        // this callback will fire when it will 1 minute before jwt expiring
        const timer = setTimeout(()=>{
            console.log("updating auth")
            this.refreshAuth();
        }, refreshCallbackDelayInMs)

        this.timersStateManager.setAuthRefreshTimer(timer)
    }

    isAuthActual(): boolean {
        const auth = this.authenticationStateManager.getAuth();
        if (auth) {
            return !auth.expired&&!this.isTokenExpired(auth.refreshToken);
        } else return false;
    }

    isAuthExpired(): boolean {
        return !this.isAuthActual();
    }

    static getBasicManager (_store: typeof store = store) {
        const authService = new BasicAuthService();
        const timersStateManager = new TimersStateManager();
        const authenticationStateManager = new AuthenticationStateManager();
        const notificationManager = new BasicNotificationManager();
        return new BasicAuthenticationManager(authenticationStateManager, authService, timersStateManager, notificationManager);
    }

    private static lock () {
        BasicAuthenticationManager.locked = true;
    }

    private static unLock () {
        BasicAuthenticationManager.locked = false;
    }

    public logout(): void {
        this.authenticationStateManager.clearAuth();
        const timer = this.timersStateManager.getAuthRefreshTimer();
        if (timer) {
            this.clearAuthRefreshTimer();
        }
    }

}

export default BasicAuthenticationManager;