import {ToastContent, ToastOptions, TypeOptions} from "react-toastify";


export type NotificationContent = ToastContent;
export type NotificationOptions = ToastOptions;
type NotificationType = TypeOptions;

/**
 * GET NOTIFICATIONS TYPE ONLY BY notificationTypes object for flexibility!
 */
export type AppNotificationType = "ERROR" | "WARNING" | "INFO" | "SUCCESS" | "DEFAULT"

/**
 * AppNotificationType is type provided by application
 * NotificationType is notification used for concrete notification library
 */
export const notificationTypes: Record<AppNotificationType, NotificationType> = {
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
    private static readonly _duration: number = 2500;
    private static readonly _pauseOnHover: boolean = true;

    constructor(type: AppNotificationType, message: string, duration: number = BasicNotification._duration) {
        const content: NotificationContent = message;
        const options: NotificationOptions = {
            type: notificationTypes[type],
            hideProgressBar: !BasicNotification._progress,
            pauseOnHover: BasicNotification._pauseOnHover,
            autoClose: duration>0?duration:false
        };
        super(content, options);
    }
}

export interface NotificationManager {
    error(message: string): void;
    success(message: string): void;
    info(message: string): void;
    warning(message: string): void;
    addNotification(notification: Notification): void
    clearNotifications(): void;
}

