import AuthenticationManager from "./AuthenticationManager";
import {LitmusAsyncThunkConfig, ThunkArg} from "../../../redux/store";
import AuthApiService, {Credentials} from "./api/AuthApiService";
import {BasicHttpError, HttpErrorParser} from "../../../error/BasicHttpError";
import {HttpStatus} from "../../../rest/HttpStatus";
import {createAsyncThunk} from "@reduxjs/toolkit";
import AuthAction from "../../../redux/actions/AuthAction";
import serializableDeepCopy from "../../../util/functional/serializableDeepCopy";
import AuthenticationStateManager from "../../stateManagers/auth/AuthenticationStateManager";
import AuthenticationStateManagerImpl from "../../stateManagers/auth/AuthenticationStateManagerImpl";
import BasicAuthApiService from "./api/BasicAuthApiService";
import authApiService from "./api/AuthApiService";
import authentication from "../../../redux/types/auth/Authentication";
import UserIdentityManager from "../../userIdentity/UserIdentityManager";
import UserIdentityApiService from "../../api/userIdentity/UserIdentityApiService";

class BasicAuthenticationManager implements AuthenticationManager {

    constructor(private readonly authenticationStateManager: AuthenticationStateManager,
                private readonly authService: AuthApiService) {
    }

    public static getInstance (authStateManager: AuthenticationStateManager = new AuthenticationStateManagerImpl(),
                               authApiService: AuthApiService = new BasicAuthApiService()): BasicAuthenticationManager {
        return new BasicAuthenticationManager(authStateManager, authApiService)
    }

    async login({email, password}: Credentials): Promise<void> {
        const arg: ThunkArg<Credentials> = {email, password, globalPending: true}

        await this.authenticationStateManager.authenticate(this._loginThunk(arg));

        return Promise.resolve();
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
                thrownErr = new BasicHttpError({status: HttpStatus.UNAUTHENTICATED,
                    error: "Невірні облікові дані",
                    detail: null,
                    code: null,
                    properties: null,
                    type: null
                })
            }
            return rejectWithValue(serializableDeepCopy(thrownErr), {notify: true});
        }}

     )


    async refreshAuth(): Promise<void> {
        const meta: ThunkArg = {globalPending: false};

        const authThunk = this._refreshAuthThunk(meta);

        await this.authenticationStateManager.authenticate(authThunk);

        return Promise.resolve();
    }
    
    private async _refreshAuth(): Promise<void> {
        return await this.authService.refreshAuth();
    }

    private _refreshAuthThunk = createAsyncThunk<void, ThunkArg<{}>, LitmusAsyncThunkConfig>(AuthAction.AUTHENTICATE, async (arg, {rejectWithValue, fulfillWithValue})=>{
            try {
                return fulfillWithValue(await this._refreshAuth(), {notify: false});
            }
            catch (e: any) {
                return rejectWithValue(serializableDeepCopy(e), {notify: true})
            }
        }
    );

    async logout(): Promise<void> {
        try {
            await this.authService.logOut();
            this.authenticationStateManager.logout();
        } catch (e: any) {
            throw HttpErrorParser.parseError(e)
        }
        return Promise.resolve();
    }



}

export default BasicAuthenticationManager;