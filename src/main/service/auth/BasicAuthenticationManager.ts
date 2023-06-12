import AuthenticationManager from "./AuthenticationManager";
import store from "../../redux/store";
import {BasicNotificationManager, NotificationManager} from "../../redux/applicationState/Notification";
import AuthService, {Credentials} from "./AuthService";
import ErrorResponse from "../../util/apiRequest/ErrorResponse";
import {BasicHttpError, getErrMessage} from "../../util/apiRequest/BasicHttpError";
import Authentication from "../../redux/auth/Authentication";
import  {isValid} from "../../util/pureFunctions";
import jwtDecode, {JwtPayload} from "jwt-decode";
import ApplicationStateManager from "../appState/ApplicationStateManager";
import TimersStateManager from "../timers/TimersStateManager";
import ApiRequestManager, {HttpMethod} from "../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../util/apiRequest/BasicApiRequestManager";
import appConfig from "../../config/appConfig";
import BasicAuthService from "./BasicAuthService";
import {HttpStatus} from "../../util/apiRequest/HttpStatus";
import AuthenticationStateManager from "./AuthenticationStateManager";

class BasicAuthenticationManager implements AuthenticationManager {
    private readonly authenticationStateManager: AuthenticationStateManager;
    private readonly notificationManager: NotificationManager;
    private readonly appStateManager: ApplicationStateManager;
    private readonly timersStateManager: TimersStateManager;
    private readonly authService: AuthService;

    private static pending: boolean = false;

    constructor(authStateManager: AuthenticationStateManager, notificationManager: NotificationManager, authService: AuthService, appStateManager: ApplicationStateManager, timersStateManager: TimersStateManager) {
        this.authenticationStateManager = authStateManager;
        this.notificationManager = notificationManager;
        this.authService = authService;
        this.appStateManager = appStateManager;
        this.timersStateManager = timersStateManager;
    }

    async login({email, password}: Credentials): Promise<void> {
        this.appStateManager.enablePending();
        BasicAuthenticationManager.turnPendingOn();

        const authentication: Authentication | null  = await this.authService.getAuth({email, password})
            .catch(errorResponse => {
                if (errorResponse instanceof BasicHttpError&&errorResponse.status===HttpStatus.UNAUTHENTICATED) {
                    errorResponse = new BasicHttpError(HttpStatus.UNAUTHENTICATED, "Перевірте правильність введених данних")
                }
                const msg = getErrMessage(errorResponse) || 'Невідома помилка'
                this.notificationManager.error(msg)
                return null;
            })
            .finally(()=>{
                this.appStateManager.disablePending();
                BasicAuthenticationManager.turnPendingOff();
            })

        if (authentication) {
            this.authenticationStateManager.setAuth(authentication);
            if (this.timersStateManager.getAuthRefreshTimer()) {
                this.clearAuthRefreshTimer();
            }
            this.planAuthRefresh();
        }

    }
    // @todo 12.10
    // now if method checkAndRefreshAuth wont be invoked no more u will stay in ui even there is 401 error. Need to write global custom error handler

    async checkAndRefreshAuth(): Promise<void> {

        const auth = this.authenticationStateManager.getAuth();

        if (auth) {
                if (this.isAuthExpired()&&!BasicAuthenticationManager.pending) {
                    if (!this.isTokenExpired(auth.refreshToken)) {
                        try {
                            await this.refreshAuth();
                        }

                        catch (e: any) {
                            this.handleAuthRefreshErr(e)
                        }

                        finally {
                            BasicAuthenticationManager.turnPendingOff();
                        }
                    } else {
                        this.logout();
                    }
                }
        }
        else {
            if (this.timersStateManager.getAuthRefreshTimer()) {
                this.clearAuthRefreshTimer();
            }
        }
    }

    async refreshAuth(): Promise<void> {
        BasicAuthenticationManager.turnPendingOn();

        const auth = this.authenticationStateManager.getAuth();

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
            this.authenticationStateManager.setAuth(auth);

            if (this.timersStateManager.getAuthRefreshTimer()) {
                this.clearAuthRefreshTimer();
            }

            this.planAuthRefresh();
        } else {
            let error: ErrorResponse<any>|null = await BasicHttpError.getHttpErrorFromResponse(response);
            if (!error) {
                error = new BasicHttpError(401, "Помилка автентифікації. Авторизуйтесь, будь ласка, заново")
            }
            throw error;
        }

    }

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
            this.refreshAuth().catch(this.handleAuthRefreshErr.bind(this))
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

    static getBasicManager (_store: typeof store) {
        const notificationManager = new BasicNotificationManager();
        const authService = new BasicAuthService();
        const appStateManager = new ApplicationStateManager();
        const timersStateManager = new TimersStateManager();
        const authenticationStateManager = new AuthenticationStateManager();
        return new BasicAuthenticationManager(authenticationStateManager, notificationManager, authService, appStateManager, timersStateManager);
    }

    private static turnPendingOn () {
        BasicAuthenticationManager.pending = true;
    }

    private static turnPendingOff () {
        BasicAuthenticationManager.pending = false;
    }

    private handleAuthRefreshErr(e: any): void {
        const errMsg: string = getErrMessage(e)||'Під час оновлення автентифікації виникла невідома помилка';
        console.error(e);
        this.notificationManager.error(errMsg);
        this.authenticationStateManager.setExpired();
    }

    public logout(): void {
        this.authenticationStateManager.clearAuth();
        const timer = this.timersStateManager.getAuthRefreshTimer();
        if (timer) {
            window.clearTimeout(timer);
            this.timersStateManager.setAuthRefreshTimer(null);
        }
    }
}

export default BasicAuthenticationManager;