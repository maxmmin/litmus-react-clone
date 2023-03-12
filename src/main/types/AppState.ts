export type AppStateError = {
    message?: string
}

type AppState = {
    isRefreshing: boolean,
    isHeaderMenuOpened: boolean,
    error?: AppStateError | null
}

export type Meta = {
    shouldRefreshGlobally: boolean
}

export type AppStateReducible = AppState | undefined

export default AppState;