import {Action, Middleware} from "redux";
import {isActionRejected, isActionFulfilled} from "../../util/pureFunctions";
import {PayloadAction} from "@reduxjs/toolkit";
import {BasicHttpError} from "../../util/apiRequest/BasicHttpError";
import Notification, {BasicNotification, BasicNotificationManager, notificationTypes} from "./Notification";
import {MetaAction} from "./appStateReducer";
import {HttpStatus} from "../../util/apiRequest/HttpStatus";
import ErrorResponse from "../../util/apiRequest/ErrorResponse";

const notificationManagerMiddleware: Middleware<{}, {}> = ({getState, dispatch}) => (
    next
) => (action: Action) => {
    if ((action as unknown as MetaAction).meta?.arg.shouldNotifyOnEnd) {
        if (isActionFulfilled(action)||isActionRejected(action)) {
            const notificationManager = new BasicNotificationManager(dispatch);

            let notification: Notification | null = null;

            if (isActionRejected(action)) {
                const httpError = (action as PayloadAction<ErrorResponse<any>>).payload

                if (httpError) {

                    const title = httpError.title;

                    switch (httpError.status) {
                        case HttpStatus.BAD_REQUEST:
                            notification = new BasicNotification(notificationTypes.ERROR, "Невірні дані були надіслані на сервер -> "+title);
                            break;
                        case HttpStatus.UNKNOWN_ERROR:
                            notification = new BasicNotification(notificationTypes.ERROR, "Сталася невідома помилка -> "+title);
                            break;
                        case HttpStatus.NOT_FOUND:
                            break;
                        case HttpStatus.FORBIDDEN:
                            notification = new BasicNotification( notificationTypes.ERROR, "Помилка доступу "+title);
                            break;
                        case (HttpStatus.UNAUTHENTICATED): {
                            notification = new BasicNotification(notificationTypes.ERROR, "Помилка аутентифікації "+title);
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