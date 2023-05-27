/**
 * type - type of alert
 * message - msg to be shown
 * duration - time notification will stay on screen(animation exclusive)
 */
export interface Notification {
    type?: 'success' | 'info' | 'warning' | 'danger';
    message?: string,
    duration?: number;
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
    notification?: Notification | null,
}

export type Meta = {
    shouldRefreshGlobally: boolean
}

export type MetaArg<T> = T & Meta

export type AppStateReducible = AppState | undefined

export default AppState;