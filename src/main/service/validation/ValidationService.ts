import {ValidationErrors} from "../../model/ValidationErrors";

/**
 * E - entity
 * R - application creation error type of entity
 * S - server creation error type of entity
 */

export default interface ValidationService<E, R=ValidationErrors<E>, S=R> {
    validate(model: E): R;
    mapServerValidationErrors(requestModel: E, response: S): R;
    hasErrors(bindingResult: R): boolean;
}