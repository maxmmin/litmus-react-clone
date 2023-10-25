import PersonCreationApiService from "./api/PersonCreationApiService";
import PersonCreationStateManager from "./stateManager/person/PersonCreationStateManager";
import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
import PersonCreationValidationService, {
    PersonValidationObject, ServerPersonValidationObject
} from "./validation/human/person/PersonCreationValidationService";
import FileRepo from "../media/FileRepo";
import {RawRelationshipsPerson} from "../../model/human/person/Person";
import getFilesFromMedia from "../../util/media/getFilesFromMedia";
import PersonCreationApiServiceImpl from "./api/PersonCreationApiServiceImpl";
import PersonCreationStateManagerImpl from "./stateManager/person/PersonCreationStateManagerImpl";
import PersonDtoMapperImpl from "../../rest/dto/dtoMappers/PersonDtoMapperImpl";
import PersonCreationValidationServiceImpl from "./validation/human/person/PersonCreationValidationServiceImpl";
import FileRepoFactory from "../media/FileRepoFactory";
import CreationServiceImpl from "./CreationServiceImpl";
import PersonRequestDto from "../../rest/dto/person/PersonRequestDto";
import PersonResponseDto from "../../rest/dto/person/PersonResponseDto";
import PersonCreationService, {PersonCreationParams} from "./PersonCreationService";

class PersonCreationServiceImpl
    extends CreationServiceImpl<PersonRequestDto, RawRelationshipsPerson, PersonResponseDto, PersonCreationParams, PersonValidationObject, ServerPersonValidationObject>
    implements PersonCreationService {
    constructor(apiService: PersonCreationApiService,
                creationStateManager: PersonCreationStateManager,
                mapper: PersonDtoMapper,
                validationService: PersonCreationValidationService,
                protected readonly fileService: FileRepo) {
        super(apiService, creationStateManager, mapper, validationService);
    }


    async createEntity(): Promise<RawRelationshipsPerson> {
        const media = this.creationStateManager.getCreationParams().media;
        const createdPerson: RawRelationshipsPerson = await super.defaultCreate();

        const linkedFiles: string[] = getFilesFromMedia(media);
        linkedFiles.forEach(file=>this.fileService.removeFile(file))
        console.log("Local media buffer cleaned");

        return createdPerson;
    }

    public static getInstance(apiService: PersonCreationApiService = PersonCreationApiServiceImpl.getInstance(),
                              stateManager: PersonCreationStateManager = new PersonCreationStateManagerImpl(),
                              mapper: PersonDtoMapper = new PersonDtoMapperImpl(),
                              validationService: PersonCreationValidationService = new PersonCreationValidationServiceImpl(),
                              fileService: FileRepo = FileRepoFactory.getGlobalFileService()): PersonCreationServiceImpl {
        return new PersonCreationServiceImpl(apiService, stateManager, mapper,validationService,fileService);
    }
}

export default PersonCreationServiceImpl