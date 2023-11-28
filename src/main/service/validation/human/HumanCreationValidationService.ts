import ValidationService from "../../ValidationService";
import Human, {FullNameCreationParams} from "../../../model/human/Human";
import {ValidationErrors} from "../../../model/ValidationErrors";

export default interface HumanCreationValidationService<E extends Human, ValidationObject=ValidationErrors<E>,
    ServerValidationObject=ValidationObject> extends ValidationService<E,ValidationObject,ServerValidationObject> {
    validateFullName (params: Human):  ValidationErrors<FullNameCreationParams>;
}
