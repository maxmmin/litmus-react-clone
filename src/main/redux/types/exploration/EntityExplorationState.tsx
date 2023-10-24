import EntityExplorationParams from "./EntityExplorationParams";
import EntityExplorationData from "./EntityExplorationData";
import {ValidationErrors} from "../../../service/ValidationErrors";

/**
 * E - entityPageComponents
 * P - params type
 */
export default interface EntityExplorationState <E,P extends EntityExplorationParams> {
    params: P,
    isPending: boolean,
    data: EntityExplorationData<E, P>|null
}

