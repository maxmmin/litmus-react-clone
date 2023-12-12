import ApplicationResources from "../../redux/types/applicationResources/ApplicationResources";

export default function isAppResourcesContextInitialized (appResources: ApplicationResources): boolean {
    return Boolean(appResources.roles||appResources.corsAnywhereProxies)
}