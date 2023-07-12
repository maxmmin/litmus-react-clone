import {ValidationErrors} from "./ValidationErrors";

/**
 * E - entity
 * R - application validation error type of entity
 * S - server validation error type of entity
 */

export default interface ValidationService<E, R=E, S=R> {
    validate(model: E): ValidationErrors<R>;
    formValidationErrors(response: ValidationErrors<S>): ValidationErrors<R>;
}