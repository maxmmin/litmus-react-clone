import Loader from "./loader/Loader";
import React, {ReactNode, useContext, useEffect, useState} from "react";
import {useAppSelector} from "../redux/hooks";
import appConfig from "../config/appConfig";
import UserIdentityManager from "../service/coreServices/userIdentity/UserIdentityManager";
import {LitmusServiceContext} from "./App";
import CsrfTokenLoader from "../service/api/core/CsrfTokenLoader";
import AxiosApiManager from "../service/api/core/AxiosApiManager";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";
import NetworkErrPage from "./networkStatusPages/NetworkErrPage";
import './assets/styles/loadingPage.scss'
import isAppResourcesContextInitialized from "../util/functional/isAppResourcesContextInitialized";


type Props = {
    children: ReactNode
}

enum NetworkStatus {
    INITIAL, ONLINE,NETWORK_ERR
}

const networkErrorCodes = [
    'ERR_NETWORK'
];

async function testConnection (): Promise<NetworkStatus> {
    try {
        await AxiosApiManager.globalApiInstance.get<null>(appConfig.serverMappings.apiHost);
        return NetworkStatus.ONLINE;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            if (error.code && networkErrorCodes.includes(error.code.toUpperCase())) {
                return NetworkStatus.NETWORK_ERR;
            } else return NetworkStatus.ONLINE;
        } else {
            console.error("unexpected err")
            throw error;
        }
    }
}

const LitmusCore = ({children}: Props) => {
    const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(NetworkStatus.INITIAL);

    const isRefreshing = useAppSelector(state => state.appState!.pendingActions>0);

    const serviceContext = useContext(LitmusServiceContext);

    const appStateManager = serviceContext.appGlobalState.manager;

    const userIdentityManager: UserIdentityManager = serviceContext.userIdentity.manager;

    const authentication = useAppSelector(state => state.authentication)

    const csrfLoader: CsrfTokenLoader = serviceContext.csrfTokenLoader;

    const navigate = useNavigate();

    const appResourcesService = serviceContext.applicationResources.service;

    const resources = useAppSelector(state => state.appResources!)


    useEffect(()=>{
        if (!isAppResourcesContextInitialized(resources)&&authentication?.isAuthenticated&&networkStatus===NetworkStatus.ONLINE) {
            appResourcesService.loadAll().then(context=>{
                console.info('resources where successfully loaded');
                console.info(context)
            });
        }
    }, [networkStatus, authentication])

    useEffect(()=>{
        if (authentication?.isAuthenticated) {
            if (networkStatus===NetworkStatus.ONLINE&&resources?.roles) {
                userIdentityManager.retrieveIdentity(true).then(u=>console.log('User data retrieved:\n'+JSON.stringify(u)));
            }
        } else {
            navigate(appConfig.applicationMappings.signIn);
        }
    },[authentication, networkStatus, userIdentityManager, resources?.roles])

    async function checkConnection(): Promise<void> {
        appStateManager.enablePending();
        try {
            const status = await testConnection();
            return setNetworkStatus(status);
        } finally {
            appStateManager.disablePending();
        }
    }

    useEffect(()=>{
        checkConnection().then(()=>{});
    }, [])

    useEffect(()=>{
        if (networkStatus===NetworkStatus.ONLINE) {
            appStateManager.enablePending();
            csrfLoader.loadCsrfToken()
                .then(response => {
                    AxiosApiManager.setCsrfHeader(response.headerName);
                    AxiosApiManager.setCsrfToken(response.token);
                })
                .finally(()=>appStateManager.disablePending())
        }
    }, [authentication, networkStatus])

    if (isRefreshing) return <div className="loader-fullscreen-wrapper"><Loader/></div>;

    if (networkStatus===NetworkStatus.NETWORK_ERR) {
        return <NetworkErrPage refresh={checkConnection}/>
    }

    if (networkStatus===NetworkStatus.INITIAL) return null;

    return (
        <>{children}</>
    )

}

export default LitmusCore;