import Role from "../../../model/userIdentity/Role";
import CorsAnywhereProxyData from "../../api/nocorsproxy/CorsAnywhereProxyData";

export default interface ApplicationResourcesService {
    loadRoles(): Promise<Role[]>;
    loadCorsAnywhereProxiesList(): Promise<CorsAnywhereProxyData[]>;
}