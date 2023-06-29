import EntityExplorationParams from "./EntityExplorationParams";
import EntityExplorationData from "./EntityExplorationData";
import {ValidationErrors} from "../../../service/ValidationErrors";

/**
 * E - entity
 * P - params type
 */
export default interface EntityExplorationState <E,P extends EntityExplorationParams> {
    params: P,
    validationErrors: ValidationErrors<P>
    isPending: boolean,
    data: EntityExplorationData<E, P>|null
}

