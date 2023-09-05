import {Credentials} from "./api/AuthApiService";

interface AuthenticationManager {
    login (cred: Credentials): Promise<void>,
    refreshAuth (): Promise<void>,
    logout (): Promise<void>,
}

export default AuthenticationManager;