import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {useEffect, useMemo} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BasicNotificationManager} from "../../util/Notification";

function NotificationCenter () {
    const notifications = useAppSelector(state => state.appState?.notifications);

    const dispatch = useAppDispatch();

    useEffect(()=>{
        const notificationManager = new BasicNotificationManager(dispatch);

        if (notifications&&notifications.length>0) {
            notifications?.forEach(notification => {
                toast(notification.content, notification.options)
            })
            notificationManager.clearNotifications();
        }
    }, [notifications])

    return (
        <>
            <ToastContainer/>
        </>
    );
}

export default NotificationCenter