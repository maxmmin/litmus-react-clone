import CreationServiceImpl from "./CreationServiceImpl";
import UserRequestDto from "../../rest/dto/user/UserRequestDto";
import User from "../../model/human/user/User";
import UserResponseDto from "../../rest/dto/user/UserResponseDto";
import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";
import CreationApiService from "./api/CreationApiService";
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

export type UserCreationParams = Omit<User, "id">

class UserCreationService extends CreationServiceImpl<UserRequestDto, User, UserResponseDto, UserCreationParams, UserValidationObject, ServerUserValidationObject> {

    constructor(
        apiService: CreationApiService<UserRequestDto, UserResponseDto>,
        creationStateManager: UserCreationStateManager,
        mapper: DtoMapper<UserRequestDto, User, UserResponseDto, UserCreationParams>,
        validationService: UserCreationValidationService) {
        super(apiService, creationStateManager, mapper, validationService);
    }

    public static getInstance(apiService: CreationApiService<UserRequestDto, UserResponseDto> = UserCreationApiServiceImpl.getInstance(),
                              stateManager: UserCreationStateManager = new UserCreationStateManagerImpl(),
                              mapper: UserDtoMapper = new UserDtoMapperImpl(),
                              validationService: UserCreationValidationService = new UserCreationValidationServiceImpl()): UserCreationService {
        return  new UserCreationService(apiService, stateManager, mapper, validationService);
    }
}

export default UserCreationService;