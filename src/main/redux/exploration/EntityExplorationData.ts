import EntityExplorationParams from "./EntityExplorationParams";
import PagedData from "../../service/exploration/entityService/PagedData";

export default interface EntityExplorationData <E, P extends EntityExplorationParams> {
    response: PagedData<E>,
    requestParams: P
}