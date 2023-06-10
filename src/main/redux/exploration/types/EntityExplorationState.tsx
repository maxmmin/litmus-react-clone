import EntityExplorationParams from "./EntityExplorationParams";
import EntityExplorationData from "./EntityExplorationData";

/**
 * E - lookup type
 * P - params type
 */
export default interface EntityExplorationState <E,P extends EntityExplorationParams> {
    params: P,
    isPending: boolean,
    data: EntityExplorationData<E, P>|null
}

