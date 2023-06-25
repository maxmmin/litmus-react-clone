import CreationServiceImpl from "./CreationServiceImpl";
import UserRequestDto from "../../rest/dto/user/UserRequestDto";
import User from "../../model/human/user/User";
import UserResponseDto from "../../rest/dto/user/UserResponseDto";
import EntityCreationState from "../../redux/types/creation/EntityCreationState";
import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";
import CreationApiService from "./api/CreationApiService";
import UserDtoMapper from "../../rest/dto/dtoMappers/UserDtoMapper";
import UserCreationApiService from "./api/UserCreationApiService";
import UserCreationStateManagerImpl from "./stateManager/user/UserCreationStateManagerImpl";
import UserCreationStateManager from "./stateManager/user/UserCreationStateManager";

class UserCreationService extends CreationServiceImpl<UserRequestDto, User, UserResponseDto> {

    constructor(
        mapper: DtoMapper<UserRequestDto, User, UserResponseDto>,
        apiService: CreationApiService<UserRequestDto, UserResponseDto>,
        creationStateManager: UserCreationStateManager) {
        super(mapper, apiService, creationStateManager);
    }

    public static getInstance(): UserCreationService {
        const mapper = new UserDtoMapper();
        const apiService = UserCreationApiService.getInstance();
        const stateManager = new UserCreationStateManagerImpl();
        return  new UserCreationService(mapper, apiService, stateManager);
    }
}

export default UserCreationService;