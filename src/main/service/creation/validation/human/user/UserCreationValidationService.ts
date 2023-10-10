import HumanCreationValidationService from "../HumanCreationValidationService";
import User from "../../../../../model/human/user/User";
import {ValidationErrors} from "../../../../ValidationErrors";
import FullName from "../../../../exploration/FullName";
import {UserCreationParams} from "../../../UserCreationService";

export type UserValidationObject = ValidationErrors<Pick<UserCreationParams, keyof FullName | "password" | "email" | "role">>;

export const userDefaultValidationObject: UserValidationObject = {
    lastName: null,
    middleName: null,
    firstName: null,
    password: null,
    email: null,
    role: null
}

export type ServerUserValidationObject = Partial<ValidationErrors<User>>;

export default interface UserCreationValidationService extends HumanCreationValidationService<UserCreationParams, UserValidationObject, ServerUserValidationObject> {
}