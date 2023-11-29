
import User from "../../../model/human/user/User";
import {RoleName} from "../../../model/userIdentity/Role";
import Human, {HumanCreationParams} from "../../../model/human/Human";
import CreationService from "./CreationService";

export type UserCreationParams = Omit<User, "id"|"role"|keyof HumanCreationParams|'createdEntities'>&{
    password: string,
    repeatPassword: string,
    role: string
}&HumanCreationParams

interface UserCreationService extends CreationService<User> {


}

export default UserCreationService;