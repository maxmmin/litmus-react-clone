import Loader from "./Loader";
import {isInvalid} from "../../data/pureFunctions";
import React, {ReactNode, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {refreshUserIdentity} from "../../redux/actions/UserIdentityActions";
import {AuthActions, setAuthentication} from "../../redux/actions/AuthActions";

type Props = {
    children: ReactNode
}

const ApplicationStateManager = ({children}: Props) => {

    const dispatch = useAppDispatch();

    const authentication = useAppSelector(state => state.authentication)

    const isRefreshing = useAppSelector(state => state.appState?.refreshing)

    useEffect(()=>{
        dispatch({type: AuthActions.CHECK_AUTH})
        if (!isInvalid(authentication?.accessToken)) {
            dispatch(refreshUserIdentity(authentication!.accessToken))
        }
    },[authentication])

    useEffect(()=>{
        dispatch(setAuthentication({...authentication!, refreshTimerId: null}))
    }, [])

    if (isRefreshing) return <Loader/>

    return (<>{children}</>)

}

export default ApplicationStateManager;