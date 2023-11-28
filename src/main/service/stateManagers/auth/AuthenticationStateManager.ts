import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import Authentication, {AuthenticationReducible} from "../../../redux/types/auth/Authentication";
import ErrorResponse from "../../../rest/ErrorResponse";

interface AuthenticationStateManager {
    isAuthenticated(): boolean;
    setLoginError(error: ErrorResponse): void;
    authenticate(authThunk:  AsyncThunkAction<void, any, any>): Promise<PayloadAction<void, string, {arg: any, requestId: string, requestStatus: "fulfilled"}, never> | PayloadAction<unknown, string, unknown, unknown>>;
    logout(): void;
}

export default AuthenticationStateManager;