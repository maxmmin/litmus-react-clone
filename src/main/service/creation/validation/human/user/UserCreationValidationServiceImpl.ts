import UserCreationValidationService from "./UserCreationValidationService";
import Human from "../../../../../model/human/Human";
import HumanCreationValidationServiceImpl from "../HumanCreationValidationServiceImpl";


class UserCreationValidationServiceImpl extends HumanCreationValidationServiceImpl implements UserCreationValidationService {
    validate(model: Human): Partial<Record<keyof Human, string>> {
        const bindingResult = super.validate(model);
        return {
            ...bindingResult
        };
    }
}

export default UserCreationValidationServiceImpl;