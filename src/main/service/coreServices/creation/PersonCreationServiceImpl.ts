import PersonCreationApiService from "../../api/person/creation/PersonCreationApiService";
import PersonCreationStateManager from "../../stateManagers/creation/person/PersonCreationStateManager";
import PersonDtoMapper from "../../../rest/dto/dtoMappers/PersonDtoMapper";
import PersonCreationValidationService, {
    PersonValidationObject, ServerPersonValidationObject
} from "../../validation/human/person/PersonCreationValidationService";
import FileRepo from "../../media/FileRepo";
import {PreProcessedPerson} from "../../../model/human/person/Person";
import getFilesFromMedia from "../../../util/media/getFilesFromMedia";
import PersonCreationApiServiceImpl from "../../api/person/creation/PersonCreationApiServiceImpl";
import PersonCreationStateManagerImpl from "../../stateManagers/creation/person/PersonCreationStateManagerImpl";
import PersonDtoMapperImpl from "../../../rest/dto/dtoMappers/PersonDtoMapperImpl";
import PersonCreationValidationServiceImpl from "../../validation/human/person/PersonCreationValidationServiceImpl";
import FileRepoFactory from "../../media/FileRepoFactory";
import CreationServiceImpl from "./CreationServiceImpl";
import PersonRequestDto from "../../../rest/dto/person/PersonRequestDto";
import PersonResponseDto from "../../../rest/dto/person/PersonResponseDto";
import PersonCreationService, {PersonCreationParams} from "./PersonCreationService";

class PersonCreationServiceImpl
    extends CreationServiceImpl<PersonRequestDto, PreProcessedPerson, PersonResponseDto, PersonCreationParams,
        PersonValidationObject, ServerPersonValidationObject, PersonCreationValidationService>
    implements PersonCreationService {
    constructor(apiService: PersonCreationApiService,
                creationStateManager: PersonCreationStateManager,
                mapper: PersonDtoMapper,
                validationService: PersonCreationValidationService,
                protected readonly fileService: FileRepo) {
        super(apiService, creationStateManager, mapper, validationService);
    }


    async createEntity(): Promise<PreProcessedPerson> {
        const media = this.creationStateManager.getCreationParams().media;
        const createdPerson: PreProcessedPerson = await super.defaultCreate();

        const linkedFiles: string[] = getFilesFromMedia(media);
        linkedFiles.forEach(file=>this.fileService.removeFile(file))
        console.log("Local media buffer cleaned");

        return createdPerson;
    }

    public static getInstance(apiService: PersonCreationApiService = PersonCreationApiServiceImpl.getInstance(),
                              stateManager: PersonCreationStateManager = new PersonCreationStateManagerImpl(),
                              mapper: PersonDtoMapper = PersonDtoMapperImpl.getInstance(),
                              validationService: PersonCreationValidationService = new PersonCreationValidationServiceImpl(),
                              fileService: FileRepo = FileRepoFactory.getGlobalFileService()): PersonCreationServiceImpl {
        return new PersonCreationServiceImpl(apiService, stateManager, mapper,validationService,fileService);
    }
}

export default PersonCreationServiceImpl