import store, {AppDispatch} from "../../store";
import AppStateAction from "../../actions/AppStateAction";
import React from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import serializableDeepCopy from "../../../util/functional/serializableDeepCopy";
import Notification, {BasicNotification, NotificationManager} from "./Notification";

export class BasicNotificationManager implements NotificationManager {
    private readonly dispatch: AppDispatch = store.dispatch;

    private readonly ADD_NOTIFICATION: string = AppStateAction.ADD_NOTIFICATION;

    private readonly CLEAR_NOTIFICATIONS: string = AppStateAction.CLEAR_NOTIFICATIONS;

    isValid(value: any) {
        return typeof value === "string" || React.isValidElement(value);
    }

    addNotification(notification: Notification): void {
        console.log(notification.content)
        let content = notification.content;
        if (!this.isValid(content)) {
            console.log("invalid notification content: "+JSON.stringify(content))
            notification.content = JSON.stringify(content);
        }
        const action: PayloadAction<Notification> = {type: this.ADD_NOTIFICATION, payload: serializableDeepCopy(notification)};
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