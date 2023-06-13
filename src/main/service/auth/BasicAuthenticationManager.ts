import AuthenticationManager from "./AuthenticationManager";
import store, {LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import {BasicNotificationManager, NotificationManager} from "../../redux/applicationState/Notification";
import AuthService, {Credentials} from "./AuthService";
import ErrorResponse from "../../util/apiRequest/ErrorResponse";
import {BasicHttpError} from "../../util/apiRequest/BasicHttpError";
import Authentication, {AuthenticationReducible} from "../../redux/auth/Authentication";
import deepCopy, {checkNotEmpty, isEmpty, isValid} from "../../util/pureFunctions";
import jwtDecode, {JwtPayload} from "jwt-decode";
import ApplicationStateManager from "../appState/ApplicationStateManager";
import TimersStateManager from "../timers/TimersStateManager";
import ApiRequestManager, {HttpMethod} from "../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../util/apiRequest/BasicApiRequestManager";
import appConfig from "../../config/appConfig";
import BasicAuthService from "./BasicAuthService";
import {HttpStatus} from "../../util/apiRequest/HttpStatus";
import AuthenticationStateManager from "./AuthenticationStateManager";
import {createAsyncThunk} from "@reduxjs/toolkit";
import AuthActions from "../../redux/auth/AuthActions";

class BasicAuthenticationManager implements AuthenticationManager {
    private readonly authenticationStateManager: AuthenticationStateManager;
    private readonly timersStateManager: TimersStateManager;
    private readonly authService: AuthService;

    private static locked: boolean = false;

    constructor(authStateManager: AuthenticationStateManager, authService: AuthService, timersStateManager: TimersStateManager) {
        this.authenticationStateManager = authStateManager;
        this.authService = authService;
        this.timersStateManager = timersStateManager;
    }

    async login({email, password}: Credentials): Promise<void> {
        const arg: ThunkArg<Credentials> = {email, password, globalPending: true}
        this.authenticationStateManager.authenticate(this._loginThunk(arg))
    }

    private _loginThunk = createAsyncThunk<Authentication, Credentials, LitmusAsyncThunkConfig>(AuthActions.AUTHENTICATE, async ({email, password}, {rejectWithValue, fulfillWithValue }) => {
        BasicAuthenticationManager.lock();

        try {
            const authentication: Authentication  = await this.authService.getAuth({email, password})
            return fulfillWithValue(authentication, {notify: true, successMessage: "Ви успішно увійшли в акаунт"});
        }
        catch (thrownErr: any) {
            let err: BasicHttpError<any>;
            if ("status" in thrownErr&&"detail" in thrownErr&&thrownErr.status===HttpStatus.UNAUTHENTICATED) {
                err = new BasicHttpError({status: HttpStatus.UNAUTHENTICATED, title: "Перевірте правильність введених данних", detail: null})
            } else {
                const errResp: ErrorResponse<any> = BasicHttpError.parseError(thrownErr);
                err = new BasicHttpError<any>(errResp);
            }
            return rejectWithValue(deepCopy(err));
        }
        finally {
            BasicAuthenticationManager.unLock();
        }

    } )
    // @todo 12.10
    // now if method checkAndRefreshAuth wont be invoked no more u will stay in ui even there is 401 error. Need to write global custom error handler

    checkAndRefreshAuth(): void {

        const auth = this.authenticationStateManager.getAuth();

        if (auth) {
                if (this.isAuthExpired()&&!BasicAuthenticationManager.locked) {
                    if (!this.isTokenExpired(auth.refreshToken)) {
                        this.refreshAuth();
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

    refreshAuth(): void {
        const auth = checkNotEmpty(this.authenticationStateManager.getAuth());
        const meta: ThunkArg<Authentication> = {globalPending: false, ...auth};
        const authThunk = this._refreshAuthThunk(meta);
        this.authenticationStateManager.authenticate(authThunk);
    }

    private _refreshAuthThunk = createAsyncThunk<Authentication, ThunkArg<Authentication>, LitmusAsyncThunkConfig>(AuthActions.AUTHENTICATE, async (arg,{rejectWithValue, fulfillWithValue})=>{
            BasicAuthenticationManager.lock();

            try {
                const auth = this.authenticationStateManager.getAuth();

                if (!auth) throw new BasicHttpError({status: 401, title: "trying to refresh auth while prev auth was null}", detail: null});

                const refreshToken = auth.refreshToken;

                if (!isValid(refreshToken)) {
                    throw new BasicHttpError({status: 401, title: "Час дії refresh токену вичерпано. Будь ласка, автентифікуйтесь заново", detail: null});
                }

                const requestManager: ApiRequestManager = new BasicApiRequestManager();

                const response: Response = await requestManager
                    .url(appConfig.serverMappings.refreshTokens)
                    .body(JSON.stringify({refreshToken: refreshToken}))
                    .method(HttpMethod.POST)
                    .fetch();

                if (response.ok) {
                    const auth: Authentication = await response.json() as Authentication;
                    return fulfillWithValue(auth, {notify: false})
                } else {
                    let error: ErrorResponse<any>|null = await BasicHttpError.parseResponse(response);
                    if (!error) {
                        error = new BasicHttpError({status: 401, title: "Помилка автентифікації.", detail: null})
                    }
                    throw error;
                }
            }
            catch (e) {
                return rejectWithValue(deepCopy(BasicHttpError.parseError(e)))
            }
            finally {
                BasicAuthenticationManager.unLock();
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

        // time diff between token expiration and application token refresh(i update it earlier to prevent errors)
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
        return new BasicAuthenticationManager(authenticationStateManager, authService, timersStateManager);
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
            window.clearTimeout(timer);
            this.timersStateManager.setAuthRefreshTimer(null);
        }
    }

    public static authErrHandle (prevState: AuthenticationReducible, err: any): AuthenticationReducible {
        if (prevState&&"status" in err&&!isEmpty(err["status"])&&+err["status"]===HttpStatus.UNAUTHENTICATED) {
            if (prevState.expired) {
                return null;
        } else {
                return {...prevState, expired: true}
            }
        }
    }
}

export default BasicAuthenticationManager;