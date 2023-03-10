
export class Authentication {
    accessToken: string|null = null;
    refreshToken: string|null = null;
    refreshTimerId?: NodeJS.Timeout|null = null;
}

export type AuthenticationReducible = Authentication | null | undefined

export default Authentication;