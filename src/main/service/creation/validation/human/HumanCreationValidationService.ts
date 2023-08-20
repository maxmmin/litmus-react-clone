import ValidationService from "../../../ValidationService";
import Human from "../../../../model/human/Human";
import {ValidationErrors} from "../../../ValidationErrors";
import FullName from "../../../exploration/FullName";

export default interface HumanCreationValidationService<E extends Human, ValidationObject=ValidationErrors<E>,
    ServerValidationObject=ValidationObject> extends ValidationService<E,ValidationObject,ServerValidationObject> {
    validateFullName (params: Human):  ValidationErrors<FullName>;
}
