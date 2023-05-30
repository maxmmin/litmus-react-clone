import store, {AppDispatch} from "../redux/store";
import {addNotification, AppStateActions} from "../redux/actions/AppStateActions";
import {ToastContent, ToastOptions, TypeOptions} from "react-toastify";
import {useAppDispatch} from "../redux/hooks";


export type NotificationContent = ToastContent;
export type NotificationOptions = ToastOptions;
export type NotificationType = TypeOptions;

type BasicType = "ERROR" | "WARNING" | "INFO" | "SUCCESS" | "DEFAULT"

export const notificationTypes: Record<BasicType, NotificationType> = {
    "ERROR": 'error',
    "WARNING": 'warning',
    "INFO": 'info',
    "SUCCESS": 'success',
    "DEFAULT": 'default'
}

export default class Notification {
    content: NotificationContent;
    options: NotificationOptions;


    constructor(content: NotificationContent, options: NotificationOptions) {
        this.content = content;
        this.options = options;
    }
}

export class BasicNotification extends Notification {
    private static readonly _progress: boolean = true;
    private static readonly _duration: number = 5000;
    private static readonly _pauseOnHover: boolean = true;

    constructor(type: NotificationType, message: string, duration: number = BasicNotification._duration) {
        const content: NotificationContent = message;
        const options: NotificationOptions = {
            type: type,
            hideProgressBar: !BasicNotification._progress,
            pauseOnHover: BasicNotification._pauseOnHover,
            autoClose: duration
        };
        super(content, options);
    }
}

interface NotificationManager {
    error(message: string): void;
    success(message: string): void;
    info(message: string): void;
    warning(message: string): void;
    addNotification(notification: Notification): void
}

export class BasicNotificationManager implements NotificationManager {
    private readonly dispatch: typeof store.dispatch;

    private readonly ADD_NOTIFICATION: string = AppStateActions.ADD_NOTIFICATION;

    private readonly CLEAR_NOTIFICATIONS: string = AppStateActions.CLEAR_NOTIFICATIONS;

    constructor(dispatch: AppDispatch) {
        this.dispatch = dispatch;
    }

    addNotification(notification: Notification): void {
        this.dispatch({
            type: this.ADD_NOTIFICATION,
            payload: {...notification}
        })
    }

    clearNotifications(): void {
        this.dispatch({
            type: this.CLEAR_NOTIFICATIONS
        })
    }

    error(message: string): void {
        addNotification(new BasicNotification(notificationTypes.ERROR, message))
    }

    info(message: string): void {
        addNotification(new BasicNotification(notificationTypes.INFO, message))
    }

    success(message: string): void {
        addNotification(new BasicNotification(notificationTypes.SUCCESS, message))
    }

    warning(message: string): void {
        addNotification(new BasicNotification(notificationTypes.WARNING, message))
    }

}
