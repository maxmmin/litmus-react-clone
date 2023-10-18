import UserCreationValidationService, {
    ServerUserValidationObject,
    UserValidationObject
} from "./UserCreationValidationService";
import Human from "../../../../../model/human/Human";
import HumanCreationValidationServiceImpl from "../HumanCreationValidationServiceImpl";
import {ValidationErrors} from "../../../../ValidationErrors";
import User from "../../../../../model/human/user/User";
import {hasContent} from "../../../../../util/isEmpty";
import valueOrNull from "../../../../../util/valueOrNull";
import {UserCreationParams} from "../../../UserCreationService";

class UserCreationValidationServiceImpl extends HumanCreationValidationServiceImpl<UserCreationParams, UserValidationObject, ServerUserValidationObject> implements UserCreationValidationService {
    validate(model: UserCreationParams): UserValidationObject {
        const bindingResult: UserValidationObject = {
            ...super.validateFullName(model),
            email: null,
            password: null,
            role: null
        };
        return bindingResult;
    }

    hasErrors(bindingResult: UserValidationObject): boolean {
        return hasContent(bindingResult);
    }


    isMiddleNameValid(middleName: Human["middleName"]): string | null {
        if (middleName) {
            return super.isMiddleNameValid(middleName);
        } else return "Поле обов'язкове до заповнення";
    }

    mapServerValidationErrors(response: ServerUserValidationObject): UserValidationObject {
        return {
            lastName: valueOrNull(response.lastName),
            middleName: valueOrNull(response.middleName),
            firstName: valueOrNull(response.firstName),
            email: valueOrNull(response.email),
            role: valueOrNull(response.role),
            password: valueOrNull(response.password)
        };
    }


}

export default UserCreationValidationServiceImpl;