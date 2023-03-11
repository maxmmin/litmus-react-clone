
export type Authentication = {
    accessToken: string|null
    refreshToken: string|null
    refreshTimerId?: NodeJS.Timeout|null
}

export type AuthenticationReducible = Authentication | null | undefined

export default Authentication;