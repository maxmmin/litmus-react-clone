import Authentication from "../../../redux/types/auth/Authentication";

export type Credentials = {
    email: string,
    password: string
}

interface AuthApiService {
    refreshAuth(refreshToken: string): Promise<Authentication>;
    getAuth(credentials: Credentials): Promise<Authentication>;
}

export default AuthApiService;