import UserCreationValidationService, {
    ServerUserValidationObject,
    UserValidationObject
} from "./UserCreationValidationService";
import Human from "../../../../../model/human/Human";
import HumanCreationValidationServiceImpl from "../HumanCreationValidationServiceImpl";
import {ValidationErrors} from "../../../../ValidationErrors";
import User from "../../../../../model/human/user/User";
import {hasContent} from "../../../../../util/isEmpty";

class UserCreationValidationServiceImpl extends HumanCreationValidationServiceImpl<User, UserValidationObject, ServerUserValidationObject> implements UserCreationValidationService {
    validate(model: User): UserValidationObject {
        const bindingResult: UserValidationObject = {
            ...super.validateFullName(model),
            email: null,
            password: null,
            role: null
        };
        return bindingResult;
    }

    hasErrors(bindingResult: ValidationErrors<User>): boolean {
        return hasContent(bindingResult);
    }


    isMiddleNameValid(middleName: Human["middleName"]): string | null {
        if (middleName) {
            return super.isMiddleNameValid(middleName);
        } else return "Поле обов'язкове до заповнення";
    }

    mapServerValidationErrors(response: ValidationErrors<User>): ValidationErrors<User> {
        return {...response};
    }


}

export default UserCreationValidationServiceImpl;