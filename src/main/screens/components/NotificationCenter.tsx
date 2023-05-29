import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {Alert} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import AppStateActions from "../../redux/actions/AppStateActions";
import {NotificationManager} from "../../util/NotificationManager";
import {clearInterval} from "timers";

enum NotificationState {
    INACTIVE='INACTIVE',
    ACTIVE='ACTIVE'
}

const animationTime = 500;


function NotificationCenter () {
    const notifications = useAppSelector(state => state.appState?.notifications);


    useEffect(()=>{
        const notificationManager: NotificationManager = new NotificationManager();

        notificationManager.run();

        return ()=>notificationManager.stop();
    }, [])

    return (
        <>
            { notifications ?
                <div style={{
                    pointerEvents: "none"
                }} className={`alert-container {notificationState} notification-container`}>
                    {
                        notifications?
                        notifications.map((notification, index) => {
                            return (
                                <Alert key={index} className={"bs-alert"} variant={notification.type}>
                                    <h4 className={"text-center my-0 mx-0"}>{JSON.stringify(notification.message)}</h4>
                                </Alert>
                            )
                        })
                            :
                            null
                    }
                </div>
                :
                null
            }
        </>
    );
}

export default NotificationCenter