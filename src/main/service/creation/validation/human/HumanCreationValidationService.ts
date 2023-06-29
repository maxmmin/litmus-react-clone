import ValidationService from "../../../ValidationService";
import Human from "../../../../model/human/Human";

export default interface HumanCreationValidationService extends ValidationService<Human> {
    validateFullName (params: Human):  Partial<Record<keyof Human, string>>|null;
}
