import HumanCreationValidationService from "../HumanCreationValidationService";
import User from "../../../../../model/human/user/User";
import {ValidationErrors} from "../../../../ValidationErrors";
import FullName from "../../../../exploration/FullName";

export type UserValidationObject = ValidationErrors<Pick<User, keyof FullName | "password" | "email" | "role">>;

export const userDefaultValidationObject: UserValidationObject = {
    lastName: null,
    middleName: null,
    firstName: null,
    password: null,
    email: null,
    role: null
}

export type ServerUserValidationObject = Partial<UserValidationObject>;

export default interface UserCreationValidationService extends HumanCreationValidationService<User, UserValidationObject, ServerUserValidationObject> {
}