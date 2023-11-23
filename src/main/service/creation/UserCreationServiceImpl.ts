import UserCreationApiService from "./api/UserCreationApiService";
import UserCreationStateManager from "./stateManager/user/UserCreationStateManager";
import UserDtoMapper from "../../rest/dto/dtoMappers/UserDtoMapper";
import UserCreationValidationService, {
    ServerUserValidationObject,
    UserValidationObject
} from "./validation/human/user/UserCreationValidationService";
import UserCreationApiServiceImpl from "./api/UserCreationApiServiceImpl";
import UserCreationStateManagerImpl from "./stateManager/user/UserCreationStateManagerImpl";
import UserDtoMapperImpl from "../../rest/dto/dtoMappers/UserDtoMapperImpl";
import UserCreationValidationServiceImpl from "./validation/human/user/UserCreationValidationServiceImpl";
import CreationServiceImpl from "./CreationServiceImpl";
import UserRequestDto from "../../rest/dto/user/UserRequestDto";
import User from "../../model/human/user/User";
import UserResponseDto from "../../rest/dto/user/UserResponseDto";
import UserCreationService, {UserCreationParams} from "./UserCreationService";

class UserCreationServiceImpl
    extends CreationServiceImpl<UserRequestDto, User, UserResponseDto, UserCreationParams, UserValidationObject, ServerUserValidationObject>
    implements UserCreationService
    {
    constructor(
        apiService: UserCreationApiService,
        creationStateManager: UserCreationStateManager,
        mapper: UserDtoMapper,
        validationService: UserCreationValidationService) {
        super(apiService, creationStateManager, mapper, validationService);
    }

    public static getInstance(apiService: UserCreationApiService = UserCreationApiServiceImpl.getInstance(),
                              stateManager: UserCreationStateManager = UserCreationStateManagerImpl.getInstance(),
                              mapper: UserDtoMapper = UserDtoMapperImpl.getInstance(),
                              validationService: UserCreationValidationService = new UserCreationValidationServiceImpl()): UserCreationServiceImpl {
        return new UserCreationServiceImpl(apiService, stateManager, mapper, validationService);
    }
}

export default UserCreationServiceImpl;