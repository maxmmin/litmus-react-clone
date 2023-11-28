import {
    ValidationErrorResponse,
    ValidationErrorResponseProperties
} from "../rest/ErrorResponse";
import {HttpStatus} from "../rest/HttpStatus";


/**
 * S - server creation object type
 */
export default class ValidationError<S> extends Error implements ValidationErrorResponse<S> {
    detail: string = "Деякі поля мають невалідні значення";
    status: number = HttpStatus.UNPROCESSABLE_ENTITY;
    error: string = "Unprocessable Entity";
    properties: ValidationErrorResponseProperties<S>;
    type: string | null = null;



    constructor(errors: S) {
        super("Some creation errors were found.");
        this.properties = {
            validationErrors: errors
        }
    }
}