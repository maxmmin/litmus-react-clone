import CreationServiceImpl from "./CreationServiceImpl";
import PersonRequestDto from "../../rest/dto/person/PersonRequestDto";
import Person, {RawRelationshipsPerson, Relationship} from "../../model/human/person/Person";
import PersonResponseDto from "../../rest/dto/person/PersonResponseDto";
import PersonCreationApiService from "./api/PersonCreationApiService";
import PersonCreationStateManager from "./stateManager/person/PersonCreationStateManager";
import PersonCreationStateManagerImpl from "./stateManager/person/PersonCreationStateManagerImpl";
import PersonCreationValidationService, {
    PersonValidationObject, ServerPersonValidationObject
} from "./validation/human/person/PersonCreationValidationService";
import PersonCreationValidationServiceImpl from "./validation/human/person/PersonCreationValidationServiceImpl";
import FileRepoFactory from "../media/FileRepoFactory";
import getFilesFromMedia from "../../util/media/getFilesFromMedia";
import FileRepo from "../media/FileRepo";
import PersonDtoMapperImpl from "../../rest/dto/dtoMappers/PersonDtoMapperImpl";
import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
import PersonCreationApiServiceImpl from "./api/PersonCreationApiServiceImpl";
import {NoRelationshipsPerson} from "../../redux/types/creation/PersonCreationState";

export type RelationshipCreationParams = Omit<Relationship, 'to'> & {
    to: NoRelationshipsPerson
}

export type PersonCreationParams = Omit<Person, 'id'|'relationships'> & {
    relationships: RelationshipCreationParams[]
}

class PersonCreationService extends CreationServiceImpl<PersonRequestDto, RawRelationshipsPerson, PersonResponseDto, PersonCreationParams, PersonValidationObject, ServerPersonValidationObject> {

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
                              fileService: FileRepo = FileRepoFactory.getGlobalFileService()): PersonCreationService {
        return  new PersonCreationService(apiService, stateManager, mapper,validationService,fileService);
    }
}

export default PersonCreationService;