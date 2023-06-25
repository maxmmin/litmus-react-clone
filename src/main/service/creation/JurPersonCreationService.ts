import CreationServiceImpl from "./CreationServiceImpl";
import JurPersonRequestDto from "../../rest/dto/jurPerson/JurPersonRequestDto";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import JurPersonResponseDto from "../../rest/dto/jurPerson/JurPersonResponseDto";
import EntityCreationState from "../../redux/types/creation/EntityCreationState";
import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";

import IOC_TYPES from "../../inversify/IOC_TYPES";
import CreationApiService from "./api/CreationApiService";
import CreationStateManager from "./stateManager/CreationStateManager";
import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
import PersonCreationApiService from "./api/PersonCreationApiService";
import PersonCreationStateManagerImpl from "./stateManager/person/PersonCreationStateManagerImpl";
import JurPersonDtoMapper from "../../rest/dto/dtoMappers/JurPersonDtoMapper";
import JurPersonCreationApiService from "./api/JurPersonCreationApiService";
import JurPersonCreationStateManager from "./stateManager/jurPerson/JurPersonCreationStateManager";
import JurPersonCreationStateManagerImpl from "./stateManager/jurPerson/JurPersonCreationStateManagerImpl";

class JurPersonCreationService extends CreationServiceImpl<JurPersonRequestDto, JurPerson, JurPersonResponseDto> {

    constructor(mapper: DtoMapper<JurPersonRequestDto, JurPerson, JurPersonResponseDto>,
                apiService: CreationApiService<JurPersonRequestDto, JurPersonResponseDto>,
                creationStateManager: JurPersonCreationStateManager) {
        super(mapper, apiService, creationStateManager);
    }

    public static getInstance(mapper: DtoMapper<JurPersonRequestDto, JurPerson, JurPersonResponseDto> = new JurPersonDtoMapper(),
                              apiService: CreationApiService<JurPersonRequestDto, JurPersonResponseDto> = JurPersonCreationApiService.getInstance(),
                              stateManager: JurPersonCreationStateManager = new JurPersonCreationStateManagerImpl()): JurPersonCreationService {
        return  new JurPersonCreationService(mapper, apiService, stateManager);
    }
}

export default JurPersonCreationService;