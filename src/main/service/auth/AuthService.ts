import Authentication from "../../redux/auth/Authentication";

export type Credentials = {
    email: string,
    password: string
}

interface AuthService {
    refreshAuth(refreshToken: string): Promise<Authentication>;
    getAuth(credentials: Credentials): Promise<Authentication>;
}

export default AuthService;