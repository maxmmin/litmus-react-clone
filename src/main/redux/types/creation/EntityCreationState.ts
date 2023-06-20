export default interface EntityCreationState<P> {
    emergingEntity: P
}

export class BasicEntityCreationState<E> implements EntityCreationState<E> {
    emergingEntity: E;

    constructor(params: E) {
        this.emergingEntity = params;
    }
}