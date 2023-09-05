import Loader from "./loader/Loader";
import {onWakeUp} from "../util/pureFunctions";
import React, {ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {useAppSelector} from "../redux/hooks";
import store from "../redux/store";
import {useLoadScript} from "@react-google-maps/api";
import appConfig, {gmapsRegionOptions} from "../config/appConfig";
import {Libraries} from "@react-google-maps/api/dist/utils/make-load-script-url";
import {setMapsApiResponse} from "../redux/actions/AppStateAction";
import AuthenticationManager from "../service/auth/AuthenticationManager";
import UserIdentityManager from "../service/userIdentity/UserIdentityManager";
import {LitmusServiceContext} from "./App";
import CsrfTokenLoader from "../service/rest/CsrfTokenLoader";
import AxiosApiManager from "../service/rest/AxiosApiManager";

type Props = {
    children: ReactNode
}

const libraries: Libraries = ["places"];

const LitmusCore = ({children}: Props) => {
    const [csrfLoaded, setCsrfLoaded] = useState(false);

    const serviceContext = useContext(LitmusServiceContext);

    const userIdentityManager: UserIdentityManager = serviceContext.userIdentity.manager;

    const authentication = useAppSelector(state => state.authentication)

    const userIdentity = useAppSelector(state => state.userIdentity)

    const csrfLoader: CsrfTokenLoader = serviceContext.csrfTokenLoader;

    useEffect(()=>{
        csrfLoader.loadCsrfToken()
            .then(response => {
                AxiosApiManager.setCsrfHeader(response.headerName);
                AxiosApiManager.setCsrfToken(response.token);
                setCsrfLoaded(true);
            })
    }, [authentication])

    const isRefreshing = useAppSelector(state => state.appState?.isRefreshing)&&csrfLoaded;

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
        if (csrfLoaded&&authentication?.isAuthenticated) {
            const globalPending = !userIdentity;
            userIdentityManager.retrieveIdentity(globalPending);
        }
    },[authentication, csrfLoaded])

    return (
        <>
            {
                isRefreshing ? <Loader/> : <>{children}</>
            }
        </>
    )

}

export default LitmusCore;