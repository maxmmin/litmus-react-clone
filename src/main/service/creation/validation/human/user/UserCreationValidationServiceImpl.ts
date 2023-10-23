import UserCreationValidationService, {
    ServerUserValidationObject,
    UserValidationObject
} from "./UserCreationValidationService";
import Human, {FullNameCreationParams, HumanCreationParams} from "../../../../../model/human/Human";
import HumanCreationValidationServiceImpl from "../HumanCreationValidationServiceImpl";
import {ValidationErrors} from "../../../../ValidationErrors";
import {hasContent} from "../../../../../util/isEmpty";
import valueOrNull from "../../../../../util/valueOrNull";
import {UserCreationParams} from "../../../UserCreationService";
import Role, {RoleName} from "../../../../../redux/types/userIdentity/Role";

class UserCreationValidationServiceImpl extends HumanCreationValidationServiceImpl<UserCreationParams, UserValidationObject, ServerUserValidationObject> implements UserCreationValidationService {

    private static readonly PASSWORD_REG_EXP = /^[a-zA-Z0-9@*#_]{8,64}$/;

    private static readonly EMAIL_REG_EXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    validate(model: UserCreationParams): UserValidationObject {
        const isPwdConfirmed = this.checkIsPasswordConfirmed(model);
        const bindingResult: UserValidationObject = {
            ...super.validateFullName(model),
            email: this.validateEmail(model.email),
            password: this.validatePassword(model.password)||isPwdConfirmed,
            repeatPassword: isPwdConfirmed,
            role: this.validateRole(model.role)
        };
        return bindingResult;
    }

    validateRole(role: RoleName): string|null {
        if (Role[role]) {
            return null;
        } else return "Невалідна роль "+role.toString();
    }

    validateEmail(email: UserCreationParams["email"]): string | null {
        const isValid: boolean = UserCreationValidationServiceImpl.EMAIL_REG_EXP.test(email);
        if (!isValid) return "Невалідний email"
        else return null;
    }

    checkIsPasswordConfirmed(model: UserCreationParams): string | null {
        if (model.password!==model.repeatPassword) {
            return "Passwords do not match";
        } else return null;
    }

    validatePassword(password: UserCreationParams["password"]): string | null {
        const valid = UserCreationValidationServiceImpl.PASSWORD_REG_EXP.test(password);
        if (!valid) return "Некоректний пароль. Пароль повинен мати від 8 до 64 символів, може містити латиницю,цифри, та символи  '@', '*', '#', '_'";
        else return null;
    }

    hasErrors(bindingResult: UserValidationObject): boolean {
        return hasContent(bindingResult);
    }

    isMiddleNameValid(middleName: HumanCreationParams["middleName"]): string | null {
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
            password: valueOrNull(response.password),
            repeatPassword: null
        };
    }


}

export default UserCreationValidationServiceImpl;