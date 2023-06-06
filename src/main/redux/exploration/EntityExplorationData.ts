import EntityExplorationParams from "./EntityExplorationParams";

export default interface EntityExplorationData <E, P extends EntityExplorationParams> {
    results: Array<E>;
    isFullyLoaded: boolean;
    requestParams: P|null;
}