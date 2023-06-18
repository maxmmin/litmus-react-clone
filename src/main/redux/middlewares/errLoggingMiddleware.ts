import {Action, Middleware} from "redux";
import {isRejected} from "@reduxjs/toolkit";

const errLoggingMiddleware: Middleware<{}, {}> = () => (
    next
) => (action: Action) => {
    if (isRejected(action)) {
        console.error(action)
    }

    next(action)
};

export default errLoggingMiddleware;