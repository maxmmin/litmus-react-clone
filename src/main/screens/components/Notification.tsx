import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {Alert} from "react-bootstrap";
import {useEffect, useState} from "react";
import AppStateActions from "../../redux/actions/AppStateActions";

enum NotificationState {
    INACTIVE='INACTIVE',
    ACTIVE='ACTIVE'
}

function Notification () {
    const dispatch = useAppDispatch();

    const [notificationState, setNotificationState] = useState<NotificationState>(NotificationState.INACTIVE);

    const notification = useAppSelector(state => state.appState?.notification)

    useEffect(()=>{
        if (notification) {
            setTimeout(()=>setNotificationState(NotificationState.ACTIVE), 0)

            const duration = notification.duration||2000;

            const timers: NodeJS.Timer[] = [];
            timers.push(setTimeout(()=> {
                setNotificationState(NotificationState.INACTIVE)
                timers.push(setTimeout(()=>{
                    dispatch({type: AppStateActions.CLEAR_NOTIFICATION})
                },500)) // time of end animation
            },duration)) // time alert is staying on the screen

            return ()=>{
                timers.forEach(timer=>window.clearTimeout(timer))
            }
        }
    }, [notification])

    return (
        <>
            { notification?
                <div className={`alert-container ${notificationState}`}>
                    <Alert onAnimationEnd={()=>console.log("end")} className={"bs-alert"} variant={notification.type}>
                        <h4 className={"text-center my-0 mx-0"}>{(notification.message)?JSON.stringify(notification.message):"Трапилася помилка, спробуйте ще раз."}</h4>
                    </Alert>
                </div>
                :
                null
            }
        </>
    );
}

export default Notification