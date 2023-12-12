import {AxiosInstance} from "axios";
import AxiosApiManager from "../core/AxiosApiManager";
import appConfig from "../../../config/appConfig";
import RoleResponseDto from "../../../rest/dto/RoleResponseDto";
import ApplicationResourcesApiService from "./ApplicationResourcesApiService";
import CorsAnywhereProxyData from "../nocorsproxy/CorsAnywhereProxyData";
import ApplicationResources from "../../../redux/types/applicationResources/ApplicationResources";
import ApplicationResourcesResponseDto from "../../../rest/dto/ApplicationResourcesResponseDto";

export default class ApplicationResourcesApiServiceImpl implements ApplicationResourcesApiService {
    protected readonly apiInstance: AxiosInstance = AxiosApiManager.globalApiInstance;
    async fetchRoles(): Promise<ApplicationResourcesResponseDto["roles"]> {
        const roles = await this.apiInstance.get<RoleResponseDto[]>(appConfig.serverMappings.config.roles)
        return roles.data;
    }

    async fetchCorsAnywhereProxiesList(): Promise<ApplicationResourcesResponseDto["corsAnywhereProxies"]> {
        const proxies = await this.apiInstance.get<CorsAnywhereProxyData[]>(appConfig.serverMappings.config.corsAnywhereProxiesList)
        return proxies.data;
    }

    async fetchAppResources(): Promise<ApplicationResourcesResponseDto> {
        const config = await this.apiInstance.get<ApplicationResourcesResponseDto>(appConfig.serverMappings.config.root)
        return config.data;
    }

    public static getInstance() {
        return new ApplicationResourcesApiServiceImpl();
    }

}