
export type Credentials = {
    email: string,
    password: string
}

interface AuthApiService {
    refreshAuth(): Promise<void>;
    getAuth(credentials: Credentials): Promise<void>;
    logOut(): Promise<void>
}

export default AuthApiService;