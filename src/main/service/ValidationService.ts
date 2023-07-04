import {ValidationErrors} from "./ValidationErrors";

export default interface ValidationService<E, R=E> {
    validate(model: E): ValidationErrors<R>;
}