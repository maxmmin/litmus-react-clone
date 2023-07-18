import UserCreationValidationService from "./UserCreationValidationService";
import Human from "../../../../../model/human/Human";
import HumanCreationValidationServiceImpl from "../HumanCreationValidationServiceImpl";
import {ValidationErrors} from "../../../../ValidationErrors";
import User from "../../../../../model/human/user/User";
import {hasErrors} from "../../../../exploration/validation/BasicExplorationValidationService";


class UserCreationValidationServiceImpl extends HumanCreationValidationServiceImpl<User> implements UserCreationValidationService {
    validate(model: User): ValidationErrors<User> {
        const bindingResult: ValidationErrors<Human> = super.validateFullName(model);
        return {
            ...bindingResult
        };
    }

    hasErrors(bindingResult: ValidationErrors<User>): boolean {
        return hasErrors(bindingResult);
    }


    isMiddleNameValid(middleName: Human["middleName"]): string | undefined {
        if (middleName) {
            return super.isMiddleNameValid(middleName);
        } else return "Поле обов'язкове до заповнення";
    }

    mapServerValidationErrors(response: ValidationErrors<User>): ValidationErrors<User> {
        return {...response};
    }


}

export default UserCreationValidationServiceImpl;