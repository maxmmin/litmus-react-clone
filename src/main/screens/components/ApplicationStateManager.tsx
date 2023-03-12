import Loader from "./Loader";
import {isInvalid} from "../../data/pureFunctions";
import React, {ReactNode, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {refreshUserIdentity} from "../../redux/actions/UserIdentityActions";
import AuthActions from "../../redux/actions/AuthActions";

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

    // useEffect(()=>{
    //     if (authentication) {
    //         dispatch(setAuthentication({...authentication!, refreshTimerId: null}))
    //     }
    // }, []) @todo timer

    if (isRefreshing) return <Loader/>

    return (<>{children}</>)

}

export default ApplicationStateManager;