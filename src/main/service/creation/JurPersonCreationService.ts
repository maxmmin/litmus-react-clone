import CreationServiceImpl from "./CreationServiceImpl";
import JurPersonRequestDto from "../../rest/dto/jurPerson/JurPersonRequestDto";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import JurPersonResponseDto from "../../rest/dto/jurPerson/JurPersonResponseDto";
import EntityCreationState from "../../redux/types/creation/EntityCreationState";
import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";


import CreationApiService from "./api/CreationApiService";
import CreationStateManager from "./stateManager/CreationStateManager";
import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
import PersonCreationApiService from "./api/PersonCreationApiService";
import PersonCreationStateManagerImpl from "./stateManager/person/PersonCreationStateManagerImpl";
import JurPersonDtoMapper from "../../rest/dto/dtoMappers/JurPersonDtoMapper";
import JurPersonCreationApiService from "./api/JurPersonCreationApiService";
import JurPersonCreationStateManager from "./stateManager/jurPerson/JurPersonCreationStateManager";
import JurPersonCreationStateManagerImpl from "./stateManager/jurPerson/JurPersonCreationStateManagerImpl";
import ValidationService from "../ValidationService";
import JurPersonCreationValidationServiceImpl from "./validation/jurPerson/JurPersonCreationValidationServiceImpl";
import JurPersonCreationValidationService from "./validation/jurPerson/JurPersonCreationValidationService";

class JurPersonCreationService extends CreationServiceImpl<JurPersonRequestDto, JurPerson, JurPersonResponseDto> {

    constructor(apiService: CreationApiService<JurPersonRequestDto, JurPersonResponseDto>,
                creationStateManager: JurPersonCreationStateManager,
                mapper: DtoMapper<JurPersonRequestDto, JurPerson, JurPersonResponseDto>,
                validationService: JurPersonCreationValidationService) {
        super(apiService, creationStateManager, mapper, validationService);
    }

    public static getInstance(apiService: CreationApiService<JurPersonRequestDto, JurPersonResponseDto> = JurPersonCreationApiService.getInstance(),
                              stateManager: JurPersonCreationStateManager = new JurPersonCreationStateManagerImpl(),
                              mapper: DtoMapper<JurPersonRequestDto, JurPerson, JurPersonResponseDto> = new JurPersonDtoMapper(),
                              validationService: JurPersonCreationValidationService = new JurPersonCreationValidationServiceImpl()): JurPersonCreationService {
        return  new JurPersonCreationService(apiService, stateManager, mapper, validationService);
    }
}

export default JurPersonCreationService;