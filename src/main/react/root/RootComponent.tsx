import Loader from "../loader/Loader";
import {onWakeUp} from "../../util/pureFunctions";
import React, {ReactNode, useEffect, useMemo} from "react";
import {useAppSelector} from "../../redux/hooks";
import AuthActions from "../../redux/auth/AuthActions";
import store from "../../redux/store";
import {useLoadScript} from "@react-google-maps/api";
import appConfig, {gmapsRegionOptions} from "../../config/appConfig";
import {Libraries} from "@react-google-maps/api/dist/utils/make-load-script-url";
import {setMapsApiResponse} from "../../redux/applicationState/AppStateActions";
import {ErrorBoundary} from "react-error-boundary";
import NotificationCenter from "../notifications/NotificationCenter";
import AuthenticationManager from "../../service/auth/AuthenticationManager";
import BasicAuthenticationManager from "../../service/auth/BasicAuthenticationManager";
import UserIdentityManager from "../../service/userIdentity/UserIdentityManager";
import UserIdentityServiceImpl from "../../service/userIdentity/UserIdentityServiceImpl";
import UserIdentityManagerImpl from "../../service/userIdentity/UserIdentityManagerImpl";

type Props = {
    children: ReactNode
}

const libraries: Libraries = ["places"];

const RootComponent = ({children}: Props) => {

    const authentication = useAppSelector(state => state.authentication)

    const userIdentity = useAppSelector(state => state.userIdentity)

    const isRefreshing = useAppSelector(state => state.appState?.isRefreshing)

    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: appConfig.geoApiKey,
        libraries: libraries,
        language: gmapsRegionOptions.language!,
        region: gmapsRegionOptions.region!,
    });

    const authenticationManager: AuthenticationManager = useMemo(()=>BasicAuthenticationManager.getBasicManager(store), [])

    const userIdentityManager: UserIdentityManager = useMemo(()=>new UserIdentityManagerImpl(), []);

    useEffect(()=>{
        store.dispatch(setMapsApiResponse({isLoaded: isLoaded, loadError: loadError?{...loadError}:null}))
    }, [isLoaded, loadError])
    // fix err if no internet

    useEffect(()=>{
        authenticationManager.checkAndRefreshAuth();

        if (authenticationManager.isAuthActual()) {
            const globalPending = !userIdentity;
            userIdentityManager.retrieveIdentity(globalPending);
        }
    },[authentication])

    useEffect(() => {
       const wakeUpCheckTimerId = onWakeUp(()=>{
           console.log("wake up")
           if (authentication) {
               authenticationManager.checkAndRefreshAuth();
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

export default RootComponent;