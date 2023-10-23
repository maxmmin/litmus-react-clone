import HumanCreationValidationService from "../HumanCreationValidationService";
import User from "../../../../../model/human/user/User";
import {ValidationErrors} from "../../../../ValidationErrors";
import {UserCreationParams} from "../../../UserCreationService";
import {RoleName} from "../../../../../redux/types/userIdentity/Role";

export type UserValidationObject = ValidationErrors<UserCreationParams>;

export const userDefaultValidationObject: UserValidationObject = {
    lastName: null,
    middleName: null,
    firstName: null,
    password: null,
    repeatPassword: null,
    email: null,
    role: null
}

export type ServerUserValidationObject = Partial<ValidationErrors<UserCreationParams>>;

export default interface UserCreationValidationService extends HumanCreationValidationService<UserCreationParams, UserValidationObject, ServerUserValidationObject> {
    validatePassword(password: UserCreationParams["password"]): string|null
    checkIsPasswordConfirmed(model: Pick<UserCreationParams, "password"|"repeatPassword">): string|null
    validateEmail(email: UserCreationParams["email"]): string|null;
    validateRole(role: RoleName): string|null;
}