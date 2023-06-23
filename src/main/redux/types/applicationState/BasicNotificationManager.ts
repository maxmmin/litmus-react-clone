import {injectable} from "inversify";
import store, {AppDispatch} from "../../store";
import AppStateAction from "../../actions/AppStateAction";
import React from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import deepCopy from "../../../util/deepCopy";
import Notification, {BasicNotification, NotificationManager} from "./Notification";

@injectable()
export class BasicNotificationManager implements NotificationManager {
    private readonly dispatch: AppDispatch;

    private readonly ADD_NOTIFICATION: string = AppStateAction.ADD_NOTIFICATION;

    private readonly CLEAR_NOTIFICATIONS: string = AppStateAction.CLEAR_NOTIFICATIONS;


    constructor(dispatch: AppDispatch) {
        this.dispatch = dispatch;
    }

    static getManager(_store: typeof store): BasicNotificationManager {
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