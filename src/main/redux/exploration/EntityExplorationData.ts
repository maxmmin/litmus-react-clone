export default interface EntityExplorationData <E> {
    results: Array<E>|null;
    isFullyLoaded: boolean;
    isPending: boolean
}