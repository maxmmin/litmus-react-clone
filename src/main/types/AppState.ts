export type AppStateError = {
    message?: string
}

type AppState = {
    refreshing: boolean,
    isHeaderMenuOpened: boolean,
    error?: AppStateError | null
}

export type AppStateReducible = AppState | undefined

export default AppState;