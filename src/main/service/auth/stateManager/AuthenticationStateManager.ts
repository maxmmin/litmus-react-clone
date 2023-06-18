import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import Authentication, {AuthenticationReducible} from "../../../redux/auth/Authentication";
import ErrorResponse from "../../../util/apiRequest/ErrorResponse";

interface AuthenticationStateManager {
    retrieveAuthentication (authThunk:  AsyncThunkAction<Authentication, any, any>):  Promise<PayloadAction<Authentication, string, {arg: any, requestId: string, requestStatus: "fulfilled"}, never> | PayloadAction<unknown, string, unknown, unknown>>;
    setExpired (): void;
    getAuth(): AuthenticationReducible;
    setLoginError (error: ErrorResponse<any>): void;
    clearAuth (): void;
}

export default AuthenticationStateManager;