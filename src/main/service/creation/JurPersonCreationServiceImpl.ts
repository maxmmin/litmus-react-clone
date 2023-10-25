import JurPersonCreationApiService from "./api/JurPersonCreationApiService";
import JurPersonCreationStateManager from "./stateManager/jurPerson/JurPersonCreationStateManager";
import JurPersonDtoMapper from "../../rest/dto/dtoMappers/JurPersonDtoMapper";
import JurPersonCreationValidationService, {
    JurPersonValidationObject,
    ServerJurPersonValidationObject
} from "./validation/jurPerson/JurPersonCreationValidationService";
import JurPersonCreationApiServiceImpl from "./api/JurPersonCreationApiServiceImpl";
import JurPersonCreationStateManagerImpl from "./stateManager/jurPerson/JurPersonCreationStateManagerImpl";
import JurPersonDtoMapperImpl from "../../rest/dto/dtoMappers/JurPersonDtoMapperImpl";
import JurPersonCreationValidationServiceImpl from "./validation/jurPerson/JurPersonCreationValidationServiceImpl";
import JurPersonCreationService from "./JurPersonCreationService";
import CreationServiceImpl from "./CreationServiceImpl";
import JurPersonRequestDto from "../../rest/dto/jurPerson/JurPersonRequestDto";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import JurPersonResponseDto from "../../rest/dto/jurPerson/JurPersonResponseDto";
import {JurPersonCreationParams} from "../../redux/types/creation/JurPersonCreationState";

class JurPersonCreationServiceImpl extends CreationServiceImpl<JurPersonRequestDto, JurPerson, JurPersonResponseDto,
    JurPersonCreationParams, JurPersonValidationObject, ServerJurPersonValidationObject> implements JurPersonCreationService {
    constructor(apiService: JurPersonCreationApiService,
                creationStateManager: JurPersonCreationStateManager,
                mapper: JurPersonDtoMapper,
                validationService: JurPersonCreationValidationService) {
        super(apiService, creationStateManager, mapper, validationService);
    }

    public static getInstance(apiService: JurPersonCreationApiService = JurPersonCreationApiServiceImpl.getInstance(),
                              stateManager: JurPersonCreationStateManager = new JurPersonCreationStateManagerImpl(),
                              mapper: JurPersonDtoMapper = new JurPersonDtoMapperImpl(),
                              validationService: JurPersonCreationValidationService = new JurPersonCreationValidationServiceImpl()): JurPersonCreationServiceImpl {
        return new JurPersonCreationServiceImpl(apiService, stateManager, mapper, validationService);
    }
}

export default JurPersonCreationServiceImpl;