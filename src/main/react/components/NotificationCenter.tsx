import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {useEffect} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BasicNotificationManager} from "../../redux/applicationState/Notification";

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
        /* eslint-disable */
    }, [notifications])

    return (
        <>
            <ToastContainer/>
        </>
    );
}

export default NotificationCenter