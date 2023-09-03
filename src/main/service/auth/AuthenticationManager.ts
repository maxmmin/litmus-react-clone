import {Credentials} from "./api/AuthApiService";

interface AuthenticationManager {
    login (cred: Credentials): void,
    refreshAuth (): void,
    logout (): void,
}

export default AuthenticationManager;