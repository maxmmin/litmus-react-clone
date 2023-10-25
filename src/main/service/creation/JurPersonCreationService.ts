import CreationServiceImpl from "./CreationServiceImpl";
import JurPersonRequestDto from "../../rest/dto/jurPerson/JurPersonRequestDto";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import JurPersonResponseDto from "../../rest/dto/jurPerson/JurPersonResponseDto";
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
import CreationService from "./CreationService";

interface JurPersonCreationService extends CreationService<JurPerson> {


}

export default JurPersonCreationService;