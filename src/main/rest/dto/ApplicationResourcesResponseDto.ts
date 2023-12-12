import RoleResponseDto from "./RoleResponseDto";
import CorsAnywhereProxyData from "../../service/api/nocorsproxy/CorsAnywhereProxyData";

export default interface ApplicationResourcesResponseDto {
    roles: RoleResponseDto[];
    corsAnywhereProxies: CorsAnywhereProxyData[];
}