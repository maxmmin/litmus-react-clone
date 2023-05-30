import {Action, Middleware} from "redux";
import {RootState} from "./store";
import {isRejected} from "../util/pureFunctions";
import {isFulfilled, PayloadAction} from "@reduxjs/toolkit";
import {BasicHttpError, HttpStatus} from "../util/HttpStatus";
import Notification , {BasicNotification, notificationTypes} from "../util/Notification";

const notificationManagerMiddleware: Middleware<{}, RootState> = ({getState, dispatch}) => (
    next
) => (action: Action) => {
    const type = action.type;

    if (isFulfilled(type)||isRejected(type)) {
        let notification: Notification;

        if (isRejected(action.type)) {
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


    }

    next(action)
};