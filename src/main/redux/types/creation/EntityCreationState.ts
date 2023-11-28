import {ValidationErrors} from "../../../model/ValidationErrors";

export default interface EntityCreationState<P,E=ValidationErrors<P>> {
    emergingEntity: P;
    validationErrors: E;
}

export class BasicEntityCreationState<P, E=ValidationErrors<P>> implements EntityCreationState<P,E> {
    emergingEntity: P;
    validationErrors: E;

    constructor(params: P, errors: E) {
        this.emergingEntity = params;
        this.validationErrors = errors;
    }
}