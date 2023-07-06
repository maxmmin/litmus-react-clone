import {ValidationErrors} from "../../../service/ValidationErrors";

export default interface EntityCreationState<P,E=P> {
    emergingEntity: P;
    validationErrors: ValidationErrors<E>;
}

export class BasicEntityCreationState<P, E=P> implements EntityCreationState<P,E> {
    emergingEntity: P;
    validationErrors: ValidationErrors<E>

    constructor(params: P, errors: ValidationErrors<E>) {
        this.emergingEntity = params;
        this.validationErrors = errors;
    }
}