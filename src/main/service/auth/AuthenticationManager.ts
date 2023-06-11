interface AuthenticationManager {
    login (): void,
    checkAndRefreshAuth(): void,
    refreshAuth (): void,
    isAuthActual(): boolean,
    logout (): void,
}

export default AuthenticationManager;