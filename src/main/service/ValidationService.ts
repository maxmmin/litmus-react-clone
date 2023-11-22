import {ValidationErrors} from "./ValidationErrors";

/**
 * E - entity
 * R - application validation error type of entity
 * S - server validation error type of entity
 */

export default interface ValidationService<E, R=ValidationErrors<E>, S=R> {
    validate(model: E): R;
    mapServerValidationErrors(requestModel: E, response: S): R;
    hasErrors(bindingResult: R): boolean;
}