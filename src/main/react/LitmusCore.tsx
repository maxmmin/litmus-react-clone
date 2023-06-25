import Loader from "./loader/Loader";
import {onWakeUp} from "../util/pureFunctions";
import React, {ReactNode, useContext, useEffect, useMemo} from "react";
import {useAppSelector} from "../redux/hooks";
import store from "../redux/store";
import {useLoadScript} from "@react-google-maps/api";
import appConfig, {gmapsRegionOptions} from "../config/appConfig";
import {Libraries} from "@react-google-maps/api/dist/utils/make-load-script-url";
import {setMapsApiResponse} from "../redux/actions/AppStateAction";
import AuthenticationManager from "../service/auth/AuthenticationManager";
import UserIdentityManager from "../service/userIdentity/UserIdentityManager";
import {LitmusServiceContext} from "./App";

type Props = {
    children: ReactNode
}

const libraries: Libraries = ["places"];

const LitmusCore = ({children}: Props) => {

    const userIdentityManager: UserIdentityManager = useContext(LitmusServiceContext).userIdentity.manager;

    const authenticationManager: AuthenticationManager = useContext(LitmusServiceContext).auth.manager;

    const authentication = useAppSelector(state => state.authentication)

    const userIdentity = useAppSelector(state => state.userIdentity)

    const isRefreshing = useAppSelector(state => state.appState?.isRefreshing)

    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: appConfig.geoApiKey,
        libraries: libraries,
        language: gmapsRegionOptions.language!,
        region: gmapsRegionOptions.region!,
    });


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
            {
                isRefreshing ? <Loader/> : <>{children}</>
            }
        </>
    )

}

export default LitmusCore;