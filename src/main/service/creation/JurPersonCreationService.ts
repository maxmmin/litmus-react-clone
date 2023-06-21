import CreationServiceImpl from "./CreationServiceImpl";
import JurPersonRequestDto from "../../rest/dto/jurPerson/JurPersonRequestDto";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import JurPersonResponseDto from "../../rest/dto/jurPerson/JurPersonResponseDto";
import EntityCreationState from "../../redux/types/creation/EntityCreationState";
import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";
import {inject, injectable} from "inversify";
import IOC_TYPES from "../../inversify/IOC_TYPES";
import CreationApiService from "./api/CreationApiService";
import CreationStateManager from "./stateManager/CreationStateManager";

@injectable()
class JurPersonCreationService extends CreationServiceImpl<JurPersonRequestDto, JurPerson, JurPersonResponseDto, EntityCreationState<JurPerson>> {

    constructor(@inject(IOC_TYPES.mappers.JurPersonDtoMapper) mapper: DtoMapper<JurPersonRequestDto, JurPerson, JurPersonResponseDto>,
                @inject(IOC_TYPES.creation.apiServices.JurPersonCreationApiService) apiService: CreationApiService<JurPersonRequestDto, JurPersonResponseDto>,
                @inject(IOC_TYPES.creation.stateManagers.JurPersonCreationStateManager) creationStateManager: CreationStateManager<JurPerson, EntityCreationState<JurPerson>>) {
        super(mapper, apiService, creationStateManager);
    }
}

export default JurPersonCreationService;