import store, {AppDispatch} from "../redux/store";
import {setNotifications} from "../redux/actions/AppStateActions";

export type NotificationType = 'success' | 'info' | 'warning' | 'danger';

export interface Notification {
    type: NotificationType;
    message: string;
    duration?: number;
    removalTime?: number;
    _state: boolean
}

export class BasicNotification implements Notification {
    readonly message: string;
    readonly type: NotificationType;
    _state: boolean = true;
    readonly removalTime?: number;

    constructor(type: NotificationType, message: string, removalTime?: number) {
        this.message = message;
        this.type = type;
        this.removalTime = removalTime;
    }
}

export class NotificationManager {

    private _timerId: number|null = null;

    private readonly _frequency: number = 400;

    private readonly _removeAnimationDuration: number = 500;

    private readonly _notificationDuration: number = 5000;

    private readonly _dispatch: AppDispatch = store.dispatch;


    private getNotifications (): Notification[] {
        const notifications = store.getState().appState?.notifications;
        return notifications?notifications:[];
    }

    constructor(showUpDuration?: number, animationDuration?: number, frequency?: number) {
        if (showUpDuration) {
            this._notificationDuration = showUpDuration;
        }
        if (animationDuration) {
            this._removeAnimationDuration = animationDuration;
        }

        if (frequency) {
            this._frequency = frequency;
        }
    }

    private getRemovalTime (durationInMs?: number) {
        if (!durationInMs) durationInMs = this._notificationDuration;
        return new Date().getTime()+durationInMs;
    }

    private processNotifications () {
        const currentTime = new Date().getTime();
        // marker of notifications mutation
        let marker = false;

        const updatedNotifications = this.getNotifications()
            .map(notification => {
                const removalTime = notification.removalTime;
                console.log(removalTime)
                if (removalTime!==undefined) {
                    if (removalTime<currentTime) {
                        marker = true;

                        if (this.isActive(notification)) {
                            // clone notification with new removal time
                            // return new version of notification with disabled state
                            return {
                                ...notification,
                                removalTime: this.getRemovalTime(this._removeAnimationDuration),
                                _state: false
                            };
                        }

                        else {
                            // return null if it was already inactive
                            return null;
                        }
                    }
                        else return notification;
                }
                else {
                    marker = true;
                    return {...notification,removalTime: this.getRemovalTime(notification.duration)}
                }
            })
            .filter(Boolean) as Notification[];

        if (marker) {
            this.update(updatedNotifications);
        }
    }

    private update (notifications: Notification[]) {
        this._dispatch(setNotifications(notifications))
    }

    run () {
        if (this._timerId!==null) {
            throw new Error("notification manager is already running")
        }
        this._timerId = window.setInterval(() => {
            this.processNotifications();
        }, this._frequency);
    }

    stop () {
        if (this._timerId===null) {
            throw new Error("notification manager is not running")
        }
        window.clearInterval(this._timerId);
        this._timerId = null;
    }

    isRunning () {
        return this._timerId===null;
    }

    private isActive(notification: Notification) {
        return notification._state;
    }
}
