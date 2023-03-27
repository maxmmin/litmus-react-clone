export type AppStateError = {
    message?: string
}

type GmapsApiError = {
    name: string; message: string; stack?: string | undefined; cause?: unknown;
} | null

export type GmapsApiResponse = {
    isLoaded: boolean;
    loadError: GmapsApiError | undefined;
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

export type MetaArg<T> = T & Meta

export type AppStateReducible = AppState | undefined

export default AppState;