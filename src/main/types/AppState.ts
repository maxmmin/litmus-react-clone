export type AppStateError = {
    message?: string
}

export type GmapsApiResponse = {
    isLoaded: boolean;
    loadError: Error | undefined;
}

type AppState = {
    isRefreshing: boolean,
    isHeaderMenuOpened: boolean,
    gmapsApiState: GmapsApiResponse | null
    error?: AppStateError | null
}

export type Meta = {
    shouldRefreshGlobally: boolean
}

export type AppStateReducible = AppState | undefined

export default AppState;