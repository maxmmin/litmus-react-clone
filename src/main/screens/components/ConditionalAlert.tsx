import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {Alert} from "react-bootstrap";
import {useEffect, useState} from "react";
import AppStateActions from "../../redux/actions/AppStateActions";

enum AlertStates {
    INACTIVE='INACTIVE',
    ACTIVE='ACTIVE'
}

function ConditionalAlert () {
    const dispatch = useAppDispatch();

    const [alertState, setAlertState] = useState<AlertStates>(AlertStates.INACTIVE);

    const error = useAppSelector(state => state.appState?.error)

    useEffect(()=>{
        if (error) {
            setTimeout(()=>setAlertState(AlertStates.ACTIVE), 0)

            const timers: NodeJS.Timer[] = [];
            timers.push(setTimeout(()=> {
                setAlertState(AlertStates.INACTIVE)
                timers.push(setTimeout(()=>{
                    dispatch({type: AppStateActions.CLEAR_ERROR})
                },500)) // time of end animation
            },2000)) // time alert is staying on the screen

            return ()=>{
                timers.forEach(timer=>window.clearTimeout(timer))
            }
        }
    }, [])

    return (
        <>
            { error?
                <div className={`alert-container ${alertState}`}>
                    <Alert className={"bs-alert"} variant={'danger'}>
                        <h4 className={"text-center my-0 mx-0"}>{(error.message)?error.message:"Трапилася помилка, спробуйте ще раз."}</h4>
                    </Alert>
                </div>
                :
                null
            }
        </>
    );
}

export default ConditionalAlert