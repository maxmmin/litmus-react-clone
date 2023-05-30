import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {useEffect} from "react";
import {clearNotifications} from "../../redux/actions/AppStateActions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NotificationCenter () {
    const dispatch = useAppDispatch();

    const notifications = useAppSelector(state => state.appState?.notifications);

    useEffect(()=>{
        if (notifications&&notifications.length>0) {
            notifications?.forEach(notification => {
                console.log(notification.content)
                toast(notification.content, notification.options)
            })
            dispatch(clearNotifications());
        }
    }, [notifications])

    return (
        <>
            <ToastContainer/>
        </>
    );
}

export default NotificationCenter