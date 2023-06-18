import EntityExplorationParams from "./EntityExplorationParams";
import PagedData from "../../../rest/PagedData";

export default interface EntityExplorationData <E, P extends EntityExplorationParams> {
    response: PagedData<E>,
    requestParams: P
}