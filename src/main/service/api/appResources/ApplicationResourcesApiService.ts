import RoleResponseDto from "../../../rest/dto/RoleResponseDto";
import CorsAnywhereProxyData from "../nocorsproxy/CorsAnywhereProxyData";
import ApplicationResourcesResponseDto from "../../../rest/dto/ApplicationResourcesResponseDto";

export default interface ApplicationResourcesApiService {
    fetchRoles: ()=>Promise<ApplicationResourcesResponseDto["roles"]>;
    fetchCorsAnywhereProxiesList: ()=>Promise<ApplicationResourcesResponseDto["corsAnywhereProxies"]>;
    fetchAppResources(): Promise<ApplicationResourcesResponseDto>;
}