/**
 * type - type of alert
 * message - msg to be shown
 * duration - time notification will stay on screen(animation exclusive)
 */
import Notification from "../util/Notification";


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
    gmapsApiState: GmapsApiResponse | null,
    notifications: Notification[]
}

export type Meta = {
    shouldRefreshGlobally?: boolean,
    shouldNotifyOnEnd?: boolean
}

export type MetaArg<T> = T & Meta

export type AppStateReducible = AppState | undefined

export default AppState;