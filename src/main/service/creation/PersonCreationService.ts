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
import PersonCreationValidationService, {
    PersonValidationObject, ServerPersonValidationObject
} from "./validation/human/person/PersonCreationValidationService";
import PersonCreationValidationServiceImpl from "./validation/human/person/PersonCreationValidationServiceImpl";

class PersonCreationService extends CreationServiceImpl<PersonRequestDto, Person, PersonResponseDto, PersonValidationObject, ServerPersonValidationObject> {

    constructor(apiService: CreationApiService<PersonRequestDto, PersonResponseDto>,
                creationStateManager: PersonCreationStateManager,
                mapper: DtoMapper<PersonRequestDto, Person, PersonResponseDto>,
                validationService: PersonCreationValidationService) {
        super(apiService, creationStateManager, mapper, validationService);
    }

    public static getInstance(apiService: CreationApiService<PersonRequestDto, PersonResponseDto> = PersonCreationApiService.getInstance(),
                              stateManager: PersonCreationStateManager = new PersonCreationStateManagerImpl(),
                              mapper: DtoMapper<PersonRequestDto, Person, PersonResponseDto> = new PersonDtoMapper(),
                              validationService: PersonCreationValidationService = new PersonCreationValidationServiceImpl()): PersonCreationService {
        return  new PersonCreationService(apiService, stateManager, mapper,validationService);
    }
}

export default PersonCreationService;