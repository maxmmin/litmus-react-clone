import Loader from "./Loader";
import {checkAndRefreshAuth, isValid, onWakeUp} from "../../util/pureFunctions";
import React, {ReactNode, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {refreshUserIdentity} from "../../redux/actions/UserIdentityActions";
import AuthActions from "../../redux/actions/AuthActions";
import store from "../../redux/store";
import {useLoadScript} from "@react-google-maps/api";
import {geoApiKey, gmapsRegionOptions} from "../../util/appConfig";
import {Libraries} from "@react-google-maps/api/dist/utils/make-load-script-url";
import {setMapsApiResponse} from "../../redux/actions/AppStateActions";

type Props = {
    children: ReactNode
}

const libraries: Libraries = ["places"];

const ApplicationStateManager = ({children}: Props) => {

    const dispatch = useAppDispatch();

    const authentication = useAppSelector(state => state.authentication)

    const isRefreshing = useAppSelector(state => state.appState?.isRefreshing)

    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: geoApiKey,
        libraries: libraries,
        language: gmapsRegionOptions.language!,
        region: gmapsRegionOptions.region!,
    });

    useEffect(()=>{
        dispatch(setMapsApiResponse({isLoaded: isLoaded, loadError: loadError?{...loadError}:null}))
    }, [isLoaded, loadError])
    // fix err if no internet

    useEffect(()=>{
        dispatch({type: AuthActions.CHECK_AUTH})

        if (!!isValid(authentication?.accessToken)) {
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
    }, [authentication]);

    if (isRefreshing) return <Loader/>

    return (<>{children}</>)

}

export default ApplicationStateManager;