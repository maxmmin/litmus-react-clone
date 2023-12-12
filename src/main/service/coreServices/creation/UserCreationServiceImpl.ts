import UserCreationApiService from "../../api/user/creation/UserCreationApiService";
import UserCreationStateManager from "../../stateManagers/creation/user/UserCreationStateManager";
import UserDtoMapper from "../../dtoMappers/user/UserDtoMapper";
import UserCreationValidationService, {
    ServerUserValidationObject,
    UserValidationObject
} from "../../validation/human/user/UserCreationValidationService";
import UserCreationApiServiceImpl from "../../api/user/creation/UserCreationApiServiceImpl";
import UserCreationStateManagerImpl from "../../stateManagers/creation/user/UserCreationStateManagerImpl";
import UserDtoMapperImpl from "../../dtoMappers/user/UserDtoMapperImpl";
import UserCreationValidationServiceImpl from "../../validation/human/user/UserCreationValidationServiceImpl";
import CreationServiceImpl from "./CreationServiceImpl";
import UserRequestDto from "../../../rest/dto/user/UserRequestDto";
import User from "../../../model/human/user/User";
import UserResponseDto from "../../../rest/dto/user/UserResponseDto";
import UserCreationService, {UserCreationParams} from "./UserCreationService";

class UserCreationServiceImpl
    extends CreationServiceImpl<UserRequestDto, User, UserResponseDto, UserCreationParams, UserValidationObject, ServerUserValidationObject>
    implements UserCreationService
    {

    public static getInstance(apiService: UserCreationApiService = UserCreationApiServiceImpl.getInstance(),
                              stateManager: UserCreationStateManager = UserCreationStateManagerImpl.getInstance(),
                              mapper: UserDtoMapper = UserDtoMapperImpl.getInstance(),
                              validationService: UserCreationValidationService = new UserCreationValidationServiceImpl()): UserCreationServiceImpl {
        return new UserCreationServiceImpl(apiService, stateManager, mapper, validationService);
    }
}

export default UserCreationServiceImpl;