// @todo: WRITE ADDITIONAL FLAGS WHICH CAN BE NEEDED
import EntityExplorationData from "./EntityExplorationData";

export default class BasicEntityExplorationData <E> implements EntityExplorationData<E>{
    readonly results: Array<E>|null = null;
    readonly isFullyLoaded: boolean = false;
    readonly isPending: boolean = false;

    constructor(results?: Array<E>, isFullyLoaded?: boolean, isPending?: boolean) {
        if (results) {
            this.results = results;
        }
        if (isFullyLoaded) {
            this.isFullyLoaded = isFullyLoaded;
        }
        if (isPending) {
            this.isPending = isPending;
        }
    }
}