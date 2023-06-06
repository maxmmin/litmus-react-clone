// @todo: WRITE ADDITIONAL FLAGS WHICH CAN BE NEEDED
import EntityExplorationData from "./EntityExplorationData";
import EntityExplorationParams from "./EntityExplorationParams";

export default class BasicEntityExplorationData <E, P extends EntityExplorationParams> implements EntityExplorationData<E, P>{
    readonly results: Array<E>;
    readonly isFullyLoaded: boolean = false;
    readonly isPending: boolean = false;
    requestParams: P;

    constructor(results: Array<E>, requestParams: P, isFullyLoaded?: boolean, isPending?: boolean) {
        this.results = results;
        this.requestParams = requestParams;

        if (isFullyLoaded) {
            this.isFullyLoaded = isFullyLoaded;
        }
        
        if (isPending) {
            this.isPending = isPending;
        }
    }
}