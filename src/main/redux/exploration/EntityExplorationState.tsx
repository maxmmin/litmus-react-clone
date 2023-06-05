import EntityExplorationParams from "./EntityExplorationParams";
import EntityExplorationData from "./EntityExplorationData";

/**
 * E - entityService type
 * P - params type
 */
export default interface EntityExplorationState <E,P extends EntityExplorationParams> {
    params: P,
    data: EntityExplorationData<E>
}

