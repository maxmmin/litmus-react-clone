import {ValidationErrors} from "./ValidationErrors";

/**
 * E - entityPageComponents
 * R - application validation error type of entityPageComponents
 * S - server validation error type of entityPageComponents
 */

export default interface ValidationService<E, R=ValidationErrors<E>, S=R> {
    validate(model: E): R;
    mapServerValidationErrors(requestModel: E, response: S): R;
    hasErrors(bindingResult: R): boolean;
}