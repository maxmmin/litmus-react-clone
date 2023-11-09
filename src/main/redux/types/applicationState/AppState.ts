/**
 * type - type of alert
 * message - msg to be shown
 * duration - time notification will stay on screen(animation exclusive)
 */
import Notification from "./Notification";


type AppState = {
    isRefreshing: boolean,
    isHeaderMenuOpened: boolean,
    isOffline: boolean,
    isServerDown: boolean,
    notifications: Notification[]
}

export type AppStateReducible = AppState | undefined

export default AppState;