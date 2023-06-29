import ValidationService from "../../../ValidationService";
import Human from "../../../../model/human/Human";
import {ValidationErrors} from "../../../ValidationErrors";

export default interface HumanCreationValidationService extends ValidationService<Human> {
    validateFullName (params: Human):  ValidationErrors<Human>|null;
}
