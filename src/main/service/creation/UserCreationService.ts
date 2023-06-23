import CreationServiceImpl from "./CreationServiceImpl";
import UserRequestDto from "../../rest/dto/user/UserRequestDto";
import User from "../../model/human/user/User";
import UserResponseDto from "../../rest/dto/user/UserResponseDto";
import EntityCreationState from "../../redux/types/creation/EntityCreationState";
import {inject, injectable} from "inversify";
import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";
import IOC_TYPES from "../../inversify/IOC_TYPES";
import CreationApiService from "./api/CreationApiService";
import CreationStateManager from "./stateManager/CreationStateManager";

@injectable()
class UserCreationService extends CreationServiceImpl<UserRequestDto, User, UserResponseDto, EntityCreationState<User>> {

    constructor(
        @inject(IOC_TYPES.mappers.UserDtoMapper) private readonly _mapper: DtoMapper<UserRequestDto, User, UserResponseDto>,
        @inject(IOC_TYPES.creation.apiServices.UserCreationApiService) private readonly _apiService: CreationApiService<UserRequestDto, UserResponseDto>,
        @inject(IOC_TYPES.creation.stateManagers.UserCreationStateManager) private readonly _creationStateManager: CreationStateManager<User, EntityCreationState<User>>) {
        super(_mapper, _apiService, _creationStateManager);
    }
}

export default UserCreationService;