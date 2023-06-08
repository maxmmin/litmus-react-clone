// @todo: WRITE ADDITIONAL FLAGS WHICH CAN BE NEEDED
import EntityExplorationData from "./EntityExplorationData";
import EntityExplorationParams from "./EntityExplorationParams";
import PagedResponse from "../../service/entityService/PagedResponse";

export default class BasicEntityExplorationData <E, P extends EntityExplorationParams> implements EntityExplorationData<E, P>{
    response: PagedResponse<E>;
    requestParams: P;


    constructor(data: PagedResponse<E>, requestParams: P) {
        this.response = data;
        this.requestParams = requestParams;
    }
}