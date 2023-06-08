import EntityExplorationParams from "./EntityExplorationParams";
import PagedResponse from "../../service/entityService/PagedResponse";

export default interface EntityExplorationData <E, P extends EntityExplorationParams> {
    response: PagedResponse<E>|E,
    requestParams: P
}