import AuthenticationManager from "./AuthenticationManager";
import {LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import AuthApiService, {Credentials} from "./api/AuthApiService";
import {BasicHttpError} from "../../error/BasicHttpError";
import Authentication, {AuthenticationReducible} from "../../redux/types/auth/Authentication";
import {checkNotEmpty, isValid} from "../../util/pureFunctions";
import jwtDecode, {JwtPayload} from "jwt-decode";
import TimersStateManager from "../timers/TimersStateManager";
import {HttpStatus} from "../../rest/HttpStatus";
import {createAsyncThunk} from "@reduxjs/toolkit";
import AuthAction from "../../redux/actions/AuthAction";
import {NotificationManager} from "../../redux/types/applicationState/Notification";
import deepCopy from "../../util/deepCopy";
import AuthenticationStateManager from "./stateManager/AuthenticationStateManager";
import AuthenticationStateManagerImpl from "./stateManager/AuthenticationStateManagerImpl";
import BasicAuthApiService from "./api/BasicAuthApiService";
import {BasicNotificationManager} from "../../redux/types/applicationState/BasicNotificationManager";

class BasicAuthenticationManager implements AuthenticationManager {

    constructor(private readonly authenticationStateManager: AuthenticationStateManager,
                private readonly authService: AuthApiService) {
    }

    public static getInstance (authStateManager: AuthenticationStateManager = new AuthenticationStateManagerImpl(),
                               authApiService: AuthApiService = new BasicAuthApiService()): BasicAuthenticationManager {
        return new BasicAuthenticationManager(authStateManager, authApiService)
    }

    login({email, password}: Credentials): void {
        const arg: ThunkArg<Credentials> = {email, password, globalPending: true}

        this.authenticationStateManager.authenticate(this._loginThunk(arg));
    }

    _login({email, password}: Credentials): Promise<void> {
        return this.authService.getAuth({email, password});
}

    _loginThunk = createAsyncThunk<void, Credentials, LitmusAsyncThunkConfig>(AuthAction.AUTHENTICATE, async (credentials, {rejectWithValue, fulfillWithValue }) => {

        try {
            const authentication: void  = await this._login(credentials)
            return fulfillWithValue(authentication, {notify: true, successMessage: "Вхід в акаунт успішно виконано"});
        }
        catch (thrownErr: any) {
            if ("status" in thrownErr&&"detail" in thrownErr&&thrownErr.status===HttpStatus.UNAUTHENTICATED) {
                thrownErr = new BasicHttpError({status: HttpStatus.UNAUTHENTICATED, title: "Невірні облікові дані", detail: null})
            }
            return rejectWithValue(deepCopy(thrownErr), {notify: true});
        }}

     )
    // @todo 12.10
    // now if method checkAndRefreshAuth wont be invoked no more u will stay in ui even there is 401 error. Need to write global custom error handler

    refreshAuth(): void {
        const meta: ThunkArg = {globalPending: false};

        const authThunk = this._refreshAuthThunk(meta);

        this.authenticationStateManager
            .authenticate(authThunk);
    }
    
    private async _refreshAuth(): Promise<void> {
        return await this.authService.refreshAuth();
    }

    private _refreshAuthThunk = createAsyncThunk<void, ThunkArg<{}>, LitmusAsyncThunkConfig>(AuthAction.AUTHENTICATE, async (arg, {rejectWithValue, fulfillWithValue})=>{
            try {
                return fulfillWithValue(await this._refreshAuth(), {notify: false});
            }
            catch (e: any) {
                return rejectWithValue(deepCopy(e), {notify: true})
            }

        }
    );

    public logout(): void {
        // this.authenticationStateManager.clearAuth();
    }



}

export default BasicAuthenticationManager;