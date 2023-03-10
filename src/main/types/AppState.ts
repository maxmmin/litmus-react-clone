export type AppStateError = {
    message?: string
}

type AppState = {
    refreshing: boolean,
    isHeaderMenuOpened: boolean,
    error?: AppStateError | null
} | undefined

export default AppState;