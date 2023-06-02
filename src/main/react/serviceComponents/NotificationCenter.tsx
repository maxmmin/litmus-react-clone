import {useAppSelector} from "../../../redux/hooks";
import {useEffect} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BasicNotificationManager} from "../../../redux/applicationState/Notification";
import store from "../../../redux/store";

function NotificationCenter () {
    const notifications = useAppSelector(state => state.appState?.notifications);

    useEffect(()=>{
        const notificationManager = new BasicNotificationManager(store.dispatch);

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