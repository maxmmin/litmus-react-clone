// @todo: WRITE ADDITIONAL FLAGS WHICH CAN BE NEEDED
import EntityExplorationData from "./EntityExplorationData";
import EntityExplorationParams from "./EntityExplorationParams";
import PagedData from "../../../rest/PagedData";

export default class BasicEntityExplorationData <E, P extends EntityExplorationParams> implements EntityExplorationData<E, P>{
    response: PagedData<E>;
    requestParams: P;


    constructor(data: PagedData<E>, requestParams: P) {
        this.response = data;
        this.requestParams = requestParams;
    }
}