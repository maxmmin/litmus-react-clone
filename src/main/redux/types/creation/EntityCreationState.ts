export default interface EntityCreationState<P> {
    params: P
}

export class BasicEntityCreationState<P> implements EntityCreationState<P> {
    params: P;


    constructor(params: P) {
        this.params = params;
    }
}