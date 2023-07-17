import ErrorResponse from "../rest/ErrorResponse";
import {HttpStatus} from "../rest/HttpStatus";
import {ValidationErrors} from "../service/ValidationErrors";

export type ValidationResponse<E> = {
    detail: {
        validationErrors: E
    }
}

export default class ValidationError<E> extends Error implements ErrorResponse<E> {
    errors: E;

    detail: E | null;
    status: number = HttpStatus.UNPROCESSABLE_ENTITY;
    title: string = "Деякі поля мають невалідні значення";



    constructor(errors: E) {
        super("validation err");
        this.errors = errors;
        this.detail = errors;
    }
}