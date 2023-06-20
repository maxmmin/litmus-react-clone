import CreationServiceImpl from "./CreationServiceImpl";
import PersonRequestDto from "../../rest/dto/person/PersonRequestDto";
import Person from "../../model/human/person/Person";
import PersonResponseDto from "../../rest/dto/person/PersonResponseDto";
import EntityCreationState from "../../redux/types/creation/EntityCreationState";
import CreationApiService from "./api/CreationApiService";
import {inject, injectable} from "inversify";
import IOC_TYPES from "../../inversify/IOC_TYPES";
import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";
import CreationStateManager from "./stateManager/CreationStateManager";

@injectable()
class PersonCreationService extends CreationServiceImpl<PersonRequestDto, Person, PersonResponseDto, EntityCreationState<Person>> {

    constructor(@inject(IOC_TYPES.PersonDtoMapper) mapper: DtoMapper<PersonRequestDto, Person, PersonResponseDto>,
                @inject(IOC_TYPES.PersonCreationApiService) apiService: CreationApiService<PersonRequestDto, PersonResponseDto>,
                @inject(IOC_TYPES.PersonCreationStateManager) creationStateManager: CreationStateManager<Person, EntityCreationState<Person>>) {
        super(mapper, apiService, creationStateManager);
    }
}

export default PersonCreationService;