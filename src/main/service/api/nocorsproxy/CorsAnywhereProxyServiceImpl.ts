import CorsAnywhereProxyService from "./CorsAnywhereProxyService";
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import axiosRetry from "axios-retry";
import {checkNotEmpty} from "../../../util/pureFunctions";
import ApplicationResourcesStateManager
    from "../../stateManagers/applicationResources/ApplicationResourcesStateManager";
import ApplicationResourcesStateManagerImpl
    from "../../stateManagers/applicationResources/ApplicationResourcesStateManagerImpl";

export default class CorsAnywhereProxyServiceImpl implements CorsAnywhereProxyService {
    private axiosInstance: AxiosInstance = axios.create({
        withCredentials: false,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })

    constructor(private readonly appResourcesManager: ApplicationResourcesStateManager) {
        axiosRetry(this.axiosInstance, {
            retries: 3,
            retryDelay: (retryCount, _e) => retryCount*1000,
            retryCondition: _error => true
        })
    }

    public static getInstance(appResourcesManager: ApplicationResourcesStateManager = ApplicationResourcesStateManagerImpl.getInstance()): CorsAnywhereProxyServiceImpl {
        return new CorsAnywhereProxyServiceImpl(appResourcesManager);
    }

    async withProxy<D,B>(req: AxiosRequestConfig<B>): Promise<AxiosResponse<D>> {
        let success: boolean = false;

        const promises: Promise<AxiosResponse<D>>[] = this.appResourcesManager.getCorsAnywhereProxiesData()!.map(async proxyData => {
            const formedUrl: string = checkNotEmpty(proxyData.proxyUrlPrefix)+encodeURIComponent(checkNotEmpty(req.url));

            const config = {...req, url: formedUrl, axiosRetry: {retryCondition: () => !success}}
            if (proxyData.isApiKeyProtected) {
                config.headers = {...config.headers, [checkNotEmpty(proxyData.apiKeyData!.apiKeyHeader)]: checkNotEmpty(proxyData.apiKeyData!.apiKey)}
            }

            const r = await this.axiosInstance.request(config);

            console.info(formedUrl + " was requested");

            if (r.status === 200) {
                success = true;
            }

            return r;
        })

        return Promise.race(promises);
    }
}