import RoleResponseDto from "../../../rest/dto/RoleResponseDto";
import CorsAnywhereProxyData from "../nocorsproxy/CorsAnywhereProxyData";

export default interface ApplicationResourcesApiService {
    fetchRoles: ()=>Promise<RoleResponseDto[]>;
    fetchCorsAnywhereProxiesList: ()=>Promise<CorsAnywhereProxyData[]>
}