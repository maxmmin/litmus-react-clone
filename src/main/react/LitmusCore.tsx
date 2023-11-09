import Loader from "./loader/Loader";
import React, {ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {useAppSelector} from "../redux/hooks";
import store from "../redux/store";
import {useLoadScript} from "@react-google-maps/api";
import appConfig, {gmapsRegionOptions} from "../config/appConfig";
import {Libraries} from "@react-google-maps/api/dist/utils/make-load-script-url";
import UserIdentityManager from "../service/userIdentity/UserIdentityManager";
import {LitmusServiceContext} from "./App";
import CsrfTokenLoader from "../service/rest/CsrfTokenLoader";
import AxiosApiManager from "../service/rest/AxiosApiManager";
import {useNavigate} from "react-router-dom";

type Props = {
    children: ReactNode
}

const libraries: Libraries = ["places"];

const LitmusCore = ({children}: Props) => {
    const [isCsrfLoading, setCsrfLoading] = useState(true);

    const serviceContext = useContext(LitmusServiceContext);

    const userIdentityManager: UserIdentityManager = serviceContext.userIdentity.manager;

    const authentication = useAppSelector(state => state.authentication)

    const csrfLoader: CsrfTokenLoader = serviceContext.csrfTokenLoader;

    const navigate = useNavigate();

    useEffect(()=>{
        setCsrfLoading(true)
        csrfLoader.loadCsrfToken()
            .then(response => {
                AxiosApiManager.setCsrfHeader(response.headerName);
                AxiosApiManager.setCsrfToken(response.token);
            })
            .finally(()=>setCsrfLoading(false))
    }, [authentication])

    const isRefreshing = useAppSelector(state => state.appState?.isRefreshing)||isCsrfLoading;


    useEffect(()=>{
        if (authentication?.isAuthenticated) {
            userIdentityManager.retrieveIdentity(true).then(u=>console.log('User data retrieved:\n'+JSON.stringify(u)));
        } else {
            navigate(appConfig.applicationMappings.signIn);
        }
    },[authentication])

    return (
        <>
            {
                isRefreshing ? <Loader/> : <>{children}</>
            }
        </>
    )

}

export default LitmusCore;