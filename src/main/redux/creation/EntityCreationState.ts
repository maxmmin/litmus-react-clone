export default interface EntityCreationState<E> {
    params: E,
    isPending: boolean
}

export class BasicEntityCreationState<E> implements EntityCreationState<E> {
    isPending: boolean;
    params: E;


    constructor(params: E, isPending: boolean = false) {
        this.isPending = isPending;
        this.params = params;
    }
}