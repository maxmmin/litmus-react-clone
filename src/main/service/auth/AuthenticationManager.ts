import {Credentials} from "./api/AuthApiService";

interface AuthenticationManager {
    login (cred: Credentials): void,
    checkAndRefreshAuth(): void,
    refreshAuth (): void,
    isAuthActual(): boolean,
    logout (): void,
}

export default AuthenticationManager;