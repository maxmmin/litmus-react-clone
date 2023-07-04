import ValidationService from "../../../ValidationService";
import Human from "../../../../model/human/Human";
import {ValidationErrors} from "../../../ValidationErrors";

export default interface HumanCreationValidationService<E extends Human, M=E> extends ValidationService<E,M> {
    validateFullName (params: Human):  ValidationErrors<Human>|null;
}
