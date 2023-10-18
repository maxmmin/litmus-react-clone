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

export type UserCreationParams = Omit<User, "id"|"role">&{
    repeatPassword: string,
    role: RoleName
}

class UserCreationService extends CreationServiceImpl<UserRequestDto, User, UserResponseDto, UserCreationParams, UserValidationObject, ServerUserValidationObject> {

    constructor(
        apiService: UserCreationApiService,
        creationStateManager: UserCreationStateManager,
        mapper: UserDtoMapper,
        validationService: UserCreationValidationService) {
        super(apiService, creationStateManager, mapper, validationService);
    }

    public static getInstance(apiService: UserCreationApiService = UserCreationApiServiceImpl.getInstance(),
                              stateManager: UserCreationStateManager = new UserCreationStateManagerImpl(),
                              mapper: UserDtoMapper = new UserDtoMapperImpl(),
                              validationService: UserCreationValidationService = new UserCreationValidationServiceImpl()): UserCreationService {
        return  new UserCreationService(apiService, stateManager, mapper, validationService);
    }
}

export default UserCreationService;