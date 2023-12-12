import {AxiosInstance} from "axios";
import AxiosApiManager from "../core/AxiosApiManager";
import appConfig from "../../../config/appConfig";
import RoleResponseDto from "../../../rest/dto/RoleResponseDto";
import ApplicationResourcesApiService from "./ApplicationResourcesApiService";
import CorsAnywhereProxyData from "../nocorsproxy/CorsAnywhereProxyData";

export default class ApplicationResourcesApiServiceImpl implements ApplicationResourcesApiService {
    protected readonly apiInstance: AxiosInstance = AxiosApiManager.globalApiInstance;
    async fetchRoles(): Promise<RoleResponseDto[]> {
        const roles = await this.apiInstance.get<RoleResponseDto[]>(appConfig.serverMappings.config.roles)
        return roles.data;
    }

    async fetchCorsAnywhereProxiesList(): Promise<CorsAnywhereProxyData[]> {
        const proxies = await this.apiInstance.get<CorsAnywhereProxyData[]>(appConfig.serverMappings.config.corsAnywhereProxiesList)
        return proxies.data;
    }

    public static getInstance() {
        return new ApplicationResourcesApiServiceImpl();
    }

}