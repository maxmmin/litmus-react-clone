export type Authentication = {
    accessToken: string
    refreshToken: string,
    isExpired?: boolean
}

export type AuthenticationReducible = Authentication | null | undefined

export default Authentication;