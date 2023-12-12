import Role from "../../../model/userIdentity/Role";
import CorsAnywhereProxyData from "../../../service/api/nocorsproxy/CorsAnywhereProxyData";

export type RoleMap = Record<string, Role>

export default interface ApplicationResources  {
    roles: RoleMap|null
    corsAnywhereProxies: CorsAnywhereProxyData[]|null
}