import CreationServiceImpl from "./CreationServiceImpl";
import PersonRequestDto from "../../rest/dto/person/PersonRequestDto";
import Person from "../../model/human/person/Person";
import PersonResponseDto from "../../rest/dto/person/PersonResponseDto";
import EntityCreationState from "../../redux/types/creation/EntityCreationState";
import CreationApiService from "./api/CreationApiService";


import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";
import CreationStateManager from "./stateManager/CreationStateManager";
import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
import PersonCreationApiService from "./api/PersonCreationApiService";
import PersonCreationStateManager from "./stateManager/person/PersonCreationStateManager";
import PersonCreationStateManagerImpl from "./stateManager/person/PersonCreationStateManagerImpl";

class PersonCreationService extends CreationServiceImpl<PersonRequestDto, Person, PersonResponseDto> {

    constructor(apiService: CreationApiService<PersonRequestDto, PersonResponseDto>,
                creationStateManager: PersonCreationStateManager,
                mapper: DtoMapper<PersonRequestDto, Person, PersonResponseDto>) {
        super(apiService, creationStateManager,mapper);
    }

    public static getInstance(apiService: CreationApiService<PersonRequestDto, PersonResponseDto> = PersonCreationApiService.getInstance(),
                              stateManager: PersonCreationStateManager = new PersonCreationStateManagerImpl(),
                              mapper: DtoMapper<PersonRequestDto, Person, PersonResponseDto> = new PersonDtoMapper()): PersonCreationService {
        return  new PersonCreationService(apiService, stateManager, mapper);
    }
}

export default PersonCreationService;