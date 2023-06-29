import EntityExplorationParams from "./EntityExplorationParams";
import EntityExplorationData from "./EntityExplorationData";

/**
 * E - entity
 * P - params type
 */
export default interface EntityExplorationState <E,P extends EntityExplorationParams> {
    params: P,
    validationErrors: Partial<Record<keyof P, string>>
    isPending: boolean,
    data: EntityExplorationData<E, P>|null
}

