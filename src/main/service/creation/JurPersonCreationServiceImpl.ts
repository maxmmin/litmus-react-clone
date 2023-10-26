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
import getFilesFromMedia from "../../util/media/getFilesFromMedia";
import FileRepo from "../media/FileRepo";

class JurPersonCreationServiceImpl extends CreationServiceImpl<JurPersonRequestDto, JurPerson, JurPersonResponseDto,
    JurPersonCreationParams, JurPersonValidationObject, ServerJurPersonValidationObject> implements JurPersonCreationService {
    constructor(apiService: JurPersonCreationApiService,
                creationStateManager: JurPersonCreationStateManager,
                mapper: JurPersonDtoMapper,
                validationService: JurPersonCreationValidationService,
                protected readonly fileService: FileRepo) {
        super(apiService, creationStateManager, mapper, validationService);
    }

    async createEntity(): Promise<JurPerson> {
        const media = this.creationStateManager.getCreationParams().media;
        const createdJurPerson: JurPerson = await super.defaultCreate();

        const linkedFiles: string[] = getFilesFromMedia(media);
        linkedFiles.forEach(file=>this.fileService.removeFile(file))
        console.log("Local media buffer cleaned");

        return createdJurPerson;
    }

    public static getInstance(apiService: JurPersonCreationApiService = JurPersonCreationApiServiceImpl.getInstance(),
                              stateManager: JurPersonCreationStateManager = new JurPersonCreationStateManagerImpl(),
                              mapper: JurPersonDtoMapper = JurPersonDtoMapperImpl.getInstance(),
                              validationService: JurPersonCreationValidationService = new JurPersonCreationValidationServiceImpl(),
                              fileService: FileRepo): JurPersonCreationServiceImpl {
        return new JurPersonCreationServiceImpl(apiService, stateManager, mapper, validationService, fileService);
    }
}

export default JurPersonCreationServiceImpl;