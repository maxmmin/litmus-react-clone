import UserCreationValidationService from "./UserCreationValidationService";
import Human from "../../../../../model/human/Human";
import HumanCreationValidationServiceImpl from "../HumanCreationValidationServiceImpl";
import {ValidationErrors} from "../../../../ValidationErrors";
import User from "../../../../../model/human/user/User";


class UserCreationValidationServiceImpl extends HumanCreationValidationServiceImpl implements UserCreationValidationService {
    validate(model: Human): ValidationErrors<User> {
        const bindingResult: ValidationErrors<Human> = super.validate(model);
        return {
            ...bindingResult
        };
    }
}

export default UserCreationValidationServiceImpl;