import {HttpError, HttpErrorsNames} from "../data/httpErrors";

export class Authentication {
    accessToken: string|null = null;
    refreshToken: string|null = null;
}

type AuthenticationType = {
    accessToken: string|null;
    refreshToken: string|null;
} | null | undefined

export default AuthenticationType;