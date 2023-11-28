import {AxiosInstance} from "axios";
import AxiosApiManager from "../../rest/AxiosApiManager";
import appConfig from "../../../config/appConfig";

class ResourcesApiServiceImpl implements ResourcesApiService {
    protected readonly apiInstance: AxiosInstance = AxiosApiManager.globalApiInstance;
    async fetchRoles(): Promise<RoleResponseDto[]> {
        const roles = await this.apiInstance.get<RoleResponseDto[]>(appConfig.serverMappings.auth.roles)
        return roles.data;
    }

}