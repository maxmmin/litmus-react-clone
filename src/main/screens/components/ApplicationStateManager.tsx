import Loader from "./Loader";
import {checkAndRefreshAuth, isInvalid, onWakeUp} from "../../data/pureFunctions";
import React, {ReactNode, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {refreshUserIdentity} from "../../redux/actions/UserIdentityActions";
import AuthActions from "../../redux/actions/AuthActions";
import store from "../../redux/store";

type Props = {
    children: ReactNode
}

const ApplicationStateManager = ({children}: Props) => {

    const dispatch = useAppDispatch();

    const authentication = useAppSelector(state => state.authentication)

    const isRefreshing = useAppSelector(state => state.appState?.isRefreshing)

    useEffect(()=>{
        dispatch({type: AuthActions.CHECK_AUTH})

        if (!isInvalid(authentication?.accessToken)) {
            dispatch(refreshUserIdentity({accessToken: authentication!.accessToken!,shouldRefreshGlobally: !authentication}))
        }
    },[authentication])

    useEffect(() => {
       const wakeUpCheckTimerId = onWakeUp(()=>{
           console.log("wake up")
           if (authentication) {
               checkAndRefreshAuth(authentication, store.getState().timers, dispatch)
           }
       })

        return ()=>{
           window.clearInterval(wakeUpCheckTimerId)
        }
    }, []);

    if (isRefreshing) return <Loader/>

    return (<>{children}</>)

}

export default ApplicationStateManager;