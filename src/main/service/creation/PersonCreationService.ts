import CreationServiceImpl from "./CreationServiceImpl";
import PersonRequestDto from "../../rest/dto/person/PersonRequestDto";
import Person from "../../model/human/person/Person";
import PersonResponseDto from "../../rest/dto/person/PersonResponseDto";
import EntityCreationState from "../../redux/types/creation/EntityCreationState";
import CreationApiService from "./api/CreationApiService";

import IOC_TYPES from "../../inversify/IOC_TYPES";
import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";
import CreationStateManager from "./stateManager/CreationStateManager";
import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
import PersonCreationApiService from "./api/PersonCreationApiService";
import PersonCreationStateManager from "./stateManager/person/PersonCreationStateManager";
import PersonCreationStateManagerImpl from "./stateManager/person/PersonCreationStateManagerImpl";

class PersonCreationService extends CreationServiceImpl<PersonRequestDto, Person, PersonResponseDto> {

    constructor(mapper: DtoMapper<PersonRequestDto, Person, PersonResponseDto>,
                apiService: CreationApiService<PersonRequestDto, PersonResponseDto>,
                creationStateManager: PersonCreationStateManager) {
        super(mapper, apiService, creationStateManager);
    }

    public static getInstance(mapper: DtoMapper<PersonRequestDto, Person, PersonResponseDto> = new PersonDtoMapper(),
                              apiService: CreationApiService<PersonRequestDto, PersonResponseDto> = PersonCreationApiService.getInstance(),
                              stateManager: PersonCreationStateManager = new PersonCreationStateManagerImpl()): PersonCreationService {
        return  new PersonCreationService(mapper, apiService, stateManager);
    }
}

export default PersonCreationService;