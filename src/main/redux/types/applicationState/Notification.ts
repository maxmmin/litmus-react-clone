import store, {AppDispatch} from "../../store";
import AppStateAction, {addNotification} from "../../actions/AppStateAction";
import {ToastContent, ToastOptions, TypeOptions} from "react-toastify";
import {PayloadAction} from "@reduxjs/toolkit";
import React from "react";
import deepCopy from "../../../util/deepCopy";
import BasicAuthenticationManager from "../../../service/auth/BasicAuthenticationManager";


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
}

export class BasicNotificationManager implements NotificationManager {
    private readonly dispatch: AppDispatch;

    private readonly ADD_NOTIFICATION: string = AppStateAction.ADD_NOTIFICATION;

    private readonly CLEAR_NOTIFICATIONS: string = AppStateAction.CLEAR_NOTIFICATIONS;


    constructor(dispatch: AppDispatch) {
        this.dispatch = dispatch;
    }

    static getManager(_store: typeof store = store): BasicNotificationManager {
        return new BasicNotificationManager(_store.dispatch)
    }

    isValid(value: any) {
        return typeof value === "string" || React.isValidElement(value);
    }

    addNotification(notification: Notification): void {
        let content = notification.content;
        if (!this.isValid(content)) {
            console.log("invalid")
            notification.content = JSON.stringify(content);
        }
        const action: PayloadAction<Notification> = {type: this.ADD_NOTIFICATION, payload: deepCopy(notification)};
        this.dispatch(action)
    }

    clearNotifications(): void {
        this.dispatch({
            type: this.CLEAR_NOTIFICATIONS
        })
    }

    error(message: string): void {
        this.addNotification(new BasicNotification('ERROR', message))
    }

    info(message: string): void {
        this.addNotification(new BasicNotification('INFO', message))
    }

    success(message: string): void {
        this.addNotification(new BasicNotification('SUCCESS', message))
    }

    warning(message: string): void {
        this.addNotification(new BasicNotification('WARNING', message))
    }

}
