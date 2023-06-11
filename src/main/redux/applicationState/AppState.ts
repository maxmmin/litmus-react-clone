/**
 * type - type of alert
 * message - msg to be shown
 * duration - time notification will stay on screen(animation exclusive)
 */
import Notification from "./Notification";


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

/**
 * Type is used for specifying should the state isRefresh or no while redux thunk is pending
 * And should notification be added after it's resolving
 */
export type Meta = {
    shouldPendingGlobally?: boolean,
    shouldNotifyOnEnd?: boolean
}

export type MetaArg<T> = T & Meta

export type AppStateReducible = AppState | undefined

export default AppState;