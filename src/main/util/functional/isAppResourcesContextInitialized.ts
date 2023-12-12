import ApplicationResources from "../../redux/types/applicationResources/ApplicationResources";

export default function isAppResourcesContextInitialized (appResources: ApplicationResources): boolean {
    return appResources.roles!==null && appResources.corsAnywhereProxies!==null;
}