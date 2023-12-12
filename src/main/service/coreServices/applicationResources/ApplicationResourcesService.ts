import Role from "../../../model/userIdentity/Role";
import CorsAnywhereProxyData from "../../api/nocorsproxy/CorsAnywhereProxyData";
import ApplicationResources from "../../../redux/types/applicationResources/ApplicationResources";

export default interface ApplicationResourcesService {
    loadRoles(): Promise<ApplicationResources['roles']>;
    loadCorsAnywhereProxiesList(): Promise<ApplicationResources['corsAnywhereProxies']>;
    loadAll(): Promise<ApplicationResources>;
}