export type Authentication = {
    accessToken: string
    refreshToken: string,
    expired?: boolean
}

export type AuthenticationReducible = Authentication | null | undefined

export default Authentication;