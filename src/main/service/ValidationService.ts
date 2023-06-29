import {ValidationErrors} from "./ValidationErrors";

export default interface ValidationService<E> {
    validate(model: E): ValidationErrors<E>;
}