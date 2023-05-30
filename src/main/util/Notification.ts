import store, {AppDispatch} from "../redux/store";
import {setNotifications} from "../redux/actions/AppStateActions";
import {ToastContent, ToastOptions, TypeOptions} from "react-toastify";
import {type} from "os";


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