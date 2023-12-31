import EntityExplorationParams from "./EntityExplorationParams";
import EntityExplorationData from "./EntityExplorationData";
import {ValidationErrors} from "../../../model/ValidationErrors";

/**
 * E - entity
 * P - params type
 */
export default interface EntityExplorationState <E,P extends EntityExplorationParams> {
    params: P,
    isPending: boolean,
    data: EntityExplorationData<E, P>|null
}

