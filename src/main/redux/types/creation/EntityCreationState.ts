import {ValidationErrors} from "../../../service/ValidationErrors";

export default interface EntityCreationState<P> {
    emergingEntity: P;
    validationErrors: ValidationErrors<P>;
}

export class BasicEntityCreationState<E> implements EntityCreationState<E> {
    emergingEntity: E;
    validationErrors: ValidationErrors<E>

    constructor(params: E, errors: ValidationErrors<E>) {
        this.emergingEntity = params;
        this.validationErrors = errors;
    }
}