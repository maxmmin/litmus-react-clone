/**
 * type - type of alert
 * message - msg to be shown
 * duration - time notification will stay on screen(animation exclusive)
 */
import Notification from "./Notification";


type AppState = {
    pendingActions: number,
    isHeaderMenuOpened: boolean,
    securedImgHandling: boolean,
    notifications: Notification[]
}

export type AppStateReducible = AppState | undefined

export default AppState;