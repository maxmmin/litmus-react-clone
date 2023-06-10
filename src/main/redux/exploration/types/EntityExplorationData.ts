import EntityExplorationParams from "./EntityExplorationParams";
import PagedData from "../../../util/apiRequest/PagedData";

export default interface EntityExplorationData <E, P extends EntityExplorationParams> {
    response: PagedData<E>,
    requestParams: P
}