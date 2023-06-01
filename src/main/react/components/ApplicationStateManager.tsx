import Loader from "./Loader";
import {checkAndRefreshAuth, isValid, onWakeUp} from "../../util/pureFunctions";
import React, {ReactNode, useEffect} from "react";
import {useAppSelector} from "../../redux/hooks";
import {refreshUserIdentity} from "../../redux/userIdentity/UserIdentityActions";
import AuthActions from "../../redux/auth/AuthActions";
import store from "../../redux/store";
import {useLoadScript} from "@react-google-maps/api";
import {geoApiKey, gmapsRegionOptions} from "../../util/appConfig";
import {Libraries} from "@react-google-maps/api/dist/utils/make-load-script-url";
import {setMapsApiResponse} from "../../redux/applicationState/AppStateActions";
import {ErrorBoundary} from "react-error-boundary";
import NotificationCenter from "./NotificationCenter";

type Props = {
    children: ReactNode
}

const libraries: Libraries = ["places"];

const ApplicationStateManager = ({children}: Props) => {

    const authentication = useAppSelector(state => state.authentication)

    const isRefreshing = useAppSelector(state => state.appState?.isRefreshing)

    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: geoApiKey,
        libraries: libraries,
        language: gmapsRegionOptions.language!,
        region: gmapsRegionOptions.region!,
    });

    useEffect(()=>{
        store.dispatch(setMapsApiResponse({isLoaded: isLoaded, loadError: loadError?{...loadError}:null}))
    }, [isLoaded, loadError])
    // fix err if no internet

    useEffect(()=>{
        store.dispatch({type: AuthActions.CHECK_AUTH})

        if (isValid(authentication?.accessToken)) {
            store.dispatch(refreshUserIdentity({accessToken: authentication!.accessToken!}))
        }
    },[authentication])

    useEffect(() => {
       const wakeUpCheckTimerId = onWakeUp(()=>{
           console.log("wake up")
           if (authentication) {
               checkAndRefreshAuth(authentication, store.getState().timers, store.dispatch)
           }
       })

        return ()=>{
           window.clearInterval(wakeUpCheckTimerId)
        }
    }, [authentication]);

    return (
        <>
            <ErrorBoundary fallback={<h1>Something went wrong...</h1>}>
                <NotificationCenter/>
                {
                    isRefreshing ? <Loader/> : <>{children}</>
                }
            </ErrorBoundary>
        </>
    )

}

export default ApplicationStateManager;