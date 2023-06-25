import {useAppSelector} from "../../redux/hooks";
import {useContext, useEffect} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BasicNotificationManager} from "../../redux/types/applicationState/BasicNotificationManager";
import {LitmusServiceContext} from "../App";

function NotificationCenter () {
    const notifications = useAppSelector(state => state.appState?.notifications);

    useEffect(()=>{
        const notificationManager = useContext(LitmusServiceContext).notification.manager;

        if (notifications&&notifications.length>0) {
            notifications?.forEach(notification => {
                toast(notification.content, notification.options)
            })
            notificationManager.clearNotifications();
        }
    }, [notifications])

    return (
        <>
            <ToastContainer position={'top-left'}/>
        </>
    );
}

export default NotificationCenter