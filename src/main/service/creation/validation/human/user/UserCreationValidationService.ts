import HumanCreationValidationService from "../HumanCreationValidationService";
import User from "../../../../../model/human/user/User";
import {ValidationErrors} from "../../../../ValidationErrors";

export type UserValidationObject = ValidationErrors<User>;

export type ServerUserValidationObject = ValidationErrors<User>;

export default interface UserCreationValidationService extends HumanCreationValidationService<User, UserValidationObject, ServerUserValidationObject> {
}