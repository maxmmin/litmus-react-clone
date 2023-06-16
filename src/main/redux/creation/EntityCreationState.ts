export default interface EntityCreationState<E> {
    params: E
}

export class BasicEntityCreationState<E> implements EntityCreationState<E> {
    params: E;


    constructor(params: E) {
        this.params = params;
    }
}