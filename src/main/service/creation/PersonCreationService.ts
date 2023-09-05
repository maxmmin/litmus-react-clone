import CreationServiceImpl from "./CreationServiceImpl";
import PersonRequestDto from "../../rest/dto/person/PersonRequestDto";
import Person from "../../model/human/person/Person";
import PersonResponseDto from "../../rest/dto/person/PersonResponseDto";
import CreationApiService from "./api/CreationApiService";
import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";
import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
import PersonCreationApiService from "./api/PersonCreationApiService";
import PersonCreationStateManager from "./stateManager/person/PersonCreationStateManager";
import PersonCreationStateManagerImpl from "./stateManager/person/PersonCreationStateManagerImpl";
import PersonCreationValidationService, {
    PersonValidationObject, ServerPersonValidationObject
} from "./validation/human/person/PersonCreationValidationService";
import PersonCreationValidationServiceImpl from "./validation/human/person/PersonCreationValidationServiceImpl";
import creationStateManager from "./stateManager/CreationStateManager";
import FileRepoImpl from "../media/FileRepoImpl";
import FileRepoFactory from "../media/FileRepoFactory";
import {isFulfilled} from "@reduxjs/toolkit";
import getFilesFromMedia from "../../util/media/getFilesFromMedia";
import FileRepo from "../media/FileRepo";

class PersonCreationService extends CreationServiceImpl<PersonRequestDto, Person, PersonResponseDto, PersonValidationObject, ServerPersonValidationObject> {

    constructor(apiService: CreationApiService<PersonRequestDto, PersonResponseDto>,
                creationStateManager: PersonCreationStateManager,
                mapper: DtoMapper<PersonRequestDto, Person, PersonResponseDto>,
                validationService: PersonCreationValidationService,
                protected readonly fileService: FileRepo) {
        super(apiService, creationStateManager, mapper, validationService);
    }


    async createEntity(): Promise<Person> {
        const media = this.creationStateManager.getCreationParams().media;
        const createdPerson: Person = await super.defaultCreate();

        const linkedFiles: string[] = getFilesFromMedia(media);
        linkedFiles.forEach(file=>this.fileService.removeFile(file))
        console.log("Local media buffer cleaned");

        return createdPerson;
    }

    public static getInstance(apiService: CreationApiService<PersonRequestDto, PersonResponseDto> = PersonCreationApiService.getInstance(),
                              stateManager: PersonCreationStateManager = new PersonCreationStateManagerImpl(),
                              mapper: DtoMapper<PersonRequestDto, Person, PersonResponseDto> = new PersonDtoMapper(),
                              validationService: PersonCreationValidationService = new PersonCreationValidationServiceImpl(),
                              fileService: FileRepo = FileRepoFactory.getGlobalFileService()): PersonCreationService {
        return  new PersonCreationService(apiService, stateManager, mapper,validationService,fileService);
    }
}

export default PersonCreationService;