import CreationServiceImpl from "./CreationServiceImpl";
import UserRequestDto from "../../rest/dto/user/UserRequestDto";
import User from "../../model/human/user/User";
import UserResponseDto from "../../rest/dto/user/UserResponseDto";
import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";
import CreationApiService from "./api/CreationApiService";
import UserDtoMapper from "../../rest/dto/dtoMappers/UserDtoMapper";
import UserCreationApiService from "./api/UserCreationApiService";
import UserCreationStateManagerImpl from "./stateManager/user/UserCreationStateManagerImpl";
import UserCreationStateManager from "./stateManager/user/UserCreationStateManager";


class UserCreationService extends CreationServiceImpl<UserRequestDto, User, UserResponseDto> {

    constructor(
        apiService: CreationApiService<UserRequestDto, UserResponseDto>,
        creationStateManager: UserCreationStateManager,
        mapper: DtoMapper<UserRequestDto, User, UserResponseDto>) {
        super(apiService, creationStateManager, mapper);
    }

    public static getInstance(apiService: CreationApiService<UserRequestDto, UserResponseDto> = UserCreationApiService.getInstance(),
                              stateManager: UserCreationStateManager = new UserCreationStateManagerImpl(),
                              mapper: DtoMapper<UserRequestDto, User, UserResponseDto> = new UserDtoMapper()): UserCreationService {
        return  new UserCreationService(apiService, stateManager, mapper);
    }
}

export default UserCreationService;