interface AuthenticationManager {
    login (): void,
    checkAndRefreshAuth(): void,
    refreshAuth (): void,
    logout (): void,
}

export default AuthenticationManager;