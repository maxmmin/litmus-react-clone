import ErrorResponse from "../rest/ErrorResponse";
import {HttpStatus} from "../rest/HttpStatus";

export default class ValidationError<P> extends Error implements ErrorResponse<Partial<Record<keyof P, string>>>{
    errors: Partial<Record<keyof P, string>>;

    detail: Partial<Record<keyof P, string>> | null;
    status: number = HttpStatus.UNPROCESSABLE_ENTITY;
    title: string = "Деякі поля мають невалідні значення";



    constructor(errors: Partial<Record<keyof P, string>>) {
        super("validation err");
        this.errors = errors;
        this.detail = errors;
    }
}