import CreationServiceImpl from "./CreationServiceImpl";
import UserRequestDto from "../../rest/dto/user/UserRequestDto";
import User from "../../model/human/user/User";
import UserResponseDto from "../../rest/dto/user/UserResponseDto";

import UserDtoMapper from "../../rest/dto/dtoMappers/UserDtoMapper";
import UserCreationStateManagerImpl from "./stateManager/user/UserCreationStateManagerImpl";
import UserCreationStateManager from "./stateManager/user/UserCreationStateManager";
import UserCreationValidationService, {
    ServerUserValidationObject,
    UserValidationObject
} from "./validation/human/user/UserCreationValidationService";
import UserCreationValidationServiceImpl from "./validation/human/user/UserCreationValidationServiceImpl";
import UserDtoMapperImpl from "../../rest/dto/dtoMappers/UserDtoMapperImpl";
import UserCreationApiServiceImpl from "./api/UserCreationApiServiceImpl";
import UserCreationApiService from "./api/UserCreationApiService";
import {RoleName} from "../../redux/types/userIdentity/Role";
import Human, {HumanCreationParams} from "../../model/human/Human";
import CreationService from "./CreationService";

export type UserCreationParams = Omit<User, "id"|"role"|keyof Human>&{
    password: string,
    repeatPassword: string,
    role: RoleName
}&HumanCreationParams

interface UserCreationService extends CreationService<User> {


}

export default UserCreationService;