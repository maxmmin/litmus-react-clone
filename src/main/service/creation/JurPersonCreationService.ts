import CreationServiceImpl from "./CreationServiceImpl";
import JurPersonRequestDto from "../../rest/dto/jurPerson/JurPersonRequestDto";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import JurPersonResponseDto from "../../rest/dto/jurPerson/JurPersonResponseDto";
import CreationApiService from "./api/CreationApiService";
import JurPersonDtoMapper from "../../rest/dto/dtoMappers/JurPersonDtoMapper";
import JurPersonCreationApiService from "./api/JurPersonCreationApiService";
import JurPersonCreationStateManager from "./stateManager/jurPerson/JurPersonCreationStateManager";
import JurPersonCreationStateManagerImpl from "./stateManager/jurPerson/JurPersonCreationStateManagerImpl";
import JurPersonCreationValidationServiceImpl from "./validation/jurPerson/JurPersonCreationValidationServiceImpl";
import JurPersonCreationValidationService, {
    JurPersonValidationObject, ServerJurPersonValidationObject
} from "./validation/jurPerson/JurPersonCreationValidationService";
import {JurPersonCreationParams} from "../../redux/types/creation/JurPersonCreationState";
import JurPersonDtoMapperImpl from "../../rest/dto/dtoMappers/JurPersonDtoMapperImpl";
import JurPersonCreationApiServiceImpl from "./api/JurPersonCreationApiServiceImpl";

class JurPersonCreationService extends CreationServiceImpl<JurPersonRequestDto, JurPerson, JurPersonResponseDto,
    JurPersonCreationParams, JurPersonValidationObject, ServerJurPersonValidationObject> {

    constructor(apiService: JurPersonCreationApiService,
                creationStateManager: JurPersonCreationStateManager,
                mapper: JurPersonDtoMapper,
                validationService: JurPersonCreationValidationService) {
        super(apiService, creationStateManager, mapper, validationService);
    }

    public static getInstance(apiService: CreationApiService<JurPersonRequestDto, JurPersonResponseDto> = JurPersonCreationApiServiceImpl.getInstance(),
                              stateManager: JurPersonCreationStateManager = new JurPersonCreationStateManagerImpl(),
                              mapper: JurPersonDtoMapper = new JurPersonDtoMapperImpl(),
                              validationService: JurPersonCreationValidationService = new JurPersonCreationValidationServiceImpl()): JurPersonCreationService {
        return  new JurPersonCreationService(apiService, stateManager, mapper, validationService);
    }
}

export default JurPersonCreationService;