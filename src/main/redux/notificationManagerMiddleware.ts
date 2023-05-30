import {Action, Middleware} from "redux";
import {isActionRejected, isActionFulfilled} from "../util/pureFunctions";
import {PayloadAction} from "@reduxjs/toolkit";
import {BasicHttpError, HttpStatus} from "../util/HttpStatus";
import Notification, {BasicNotification, BasicNotificationManager, notificationTypes} from "../util/Notification";
import {MetaAction} from "./reducers/appStateReducer";

const notificationManagerMiddleware: Middleware<{}, {}> = ({getState, dispatch}) => (
    next
) => (action: Action) => {
    if ((action as unknown as MetaAction).meta?.arg.shouldNotifyOnEnd) {
        if (isActionFulfilled(action)||isActionRejected(action)) {
            const notificationManager = new BasicNotificationManager(dispatch);

            let notification: Notification | null = null;

            if (isActionRejected(action)) {
                const httpError = (action as PayloadAction<BasicHttpError>).payload

                if (httpError) {
                    switch (httpError.status) {
                        case HttpStatus.BAD_REQUEST:
                            notification = new BasicNotification(notificationTypes.ERROR, "Невірні дані були надіслані на сервер"+JSON.stringify(httpError.responseJson));
                            break;
                        case HttpStatus.UNKNOWN_ERROR:
                            notification = new BasicNotification(notificationTypes.ERROR, "Сталася невідома помилка:"+JSON.stringify(httpError.responseJson));
                            break;
                        case HttpStatus.NOT_FOUND:
                            break;
                        case HttpStatus.FORBIDDEN:
                            notification = new BasicNotification( notificationTypes.ERROR, "Помилка доступу");
                            break;
                        case (HttpStatus.UNAUTHENTICATED): {
                            notification = new BasicNotification(notificationTypes.ERROR, "Помилка аутентифікації");
                            break;
                        }
                    }
                }
            }
                else {
                    notification = new BasicNotification(notificationTypes.SUCCESS, `Дія ${action.type} успішно виконана`, 1000);
            }

            if (notification) {
                notificationManager.addNotification(notification);
            }
        }
    }

    next(action)
};

export default notificationManagerMiddleware