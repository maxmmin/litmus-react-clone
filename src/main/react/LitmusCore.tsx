import Loader from "./loader/Loader";
import React, {ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {useAppSelector} from "../redux/hooks";
import appConfig from "../config/appConfig";
import {Libraries} from "@react-google-maps/api/dist/utils/make-load-script-url";
import UserIdentityManager from "../service/userIdentity/UserIdentityManager";
import {LitmusServiceContext} from "./App";
import CsrfTokenLoader from "../service/rest/CsrfTokenLoader";
import AxiosApiManager from "../service/rest/AxiosApiManager";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";

type Props = {
    children: ReactNode
}

enum NetworkStatus {
    INITIAL, ONLINE,SERVER_DOWN,OFFLINE
}

async function testConnection (): Promise<NetworkStatus> {
    try {
        await AxiosApiManager.globalApiInstance.get<null>(appConfig.serverMappings.apiHost);
        return NetworkStatus.ONLINE;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            if (error.code === 'ECONNREFUSED') {
                return NetworkStatus.SERVER_DOWN;
            } else if (error.code === 'ENOTFOUND'||error.code === 'ECONNABORTED') {
                return NetworkStatus.OFFLINE;
            } else return NetworkStatus.ONLINE;
        } else throw new Error("unexpected err");
    }
}

const LitmusCore = ({children}: Props) => {
    const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(NetworkStatus.ONLINE);

    const isRefreshing = useAppSelector(state => state.appState?.isRefreshing);

    const serviceContext = useContext(LitmusServiceContext);

    const appStateManager = serviceContext.appState.manager;

    const userIdentityManager: UserIdentityManager = serviceContext.userIdentity.manager;

    const authentication = useAppSelector(state => state.authentication)

    const csrfLoader: CsrfTokenLoader = serviceContext.csrfTokenLoader;

    const navigate = useNavigate();

    useEffect(()=>{
        appStateManager.enablePending();
        testConnection().then(status=>setNetworkStatus(status)).finally(()=>appStateManager.disablePending());
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

    useEffect(()=>{
        if (networkStatus===NetworkStatus.ONLINE) {
            if (authentication?.isAuthenticated) {
                userIdentityManager.retrieveIdentity(true).then(u=>console.log('User data retrieved:\n'+JSON.stringify(u)));
            } else {
                navigate(appConfig.applicationMappings.signIn);
            }
        }
    },[authentication, networkStatus])

    return (
        <>
            {
                isRefreshing ? <Loader/> : <>{children}</>
            }
        </>
    )

}

export default LitmusCore;