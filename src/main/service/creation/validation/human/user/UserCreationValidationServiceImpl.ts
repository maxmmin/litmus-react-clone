import UserCreationValidationService from "./UserCreationValidationService";
import Human from "../../../../../model/human/Human";
import HumanCreationValidationServiceImpl from "../HumanCreationValidationServiceImpl";
import {ValidationErrors} from "../../../../ValidationErrors";
import User from "../../../../../model/human/user/User";


class UserCreationValidationServiceImpl extends HumanCreationValidationServiceImpl<User> implements UserCreationValidationService {
    validate(model: User): ValidationErrors<User> {
        const bindingResult: ValidationErrors<Human> = super.validate(model);
        return {
            ...bindingResult
        };
    }


    isMiddleNameValid(middleName: Human["middleName"]): string | undefined {
        if (middleName) {
            return super.isMiddleNameValid(middleName);
        } else return "Поле обов'язкове до заповнення";
    }

    formValidationErrors(response: ValidationErrors<User>): ValidationErrors<User> {
        return {...response};
    }


}

export default UserCreationValidationServiceImpl;