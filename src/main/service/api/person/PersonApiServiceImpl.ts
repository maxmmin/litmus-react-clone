import PersonExplorationApiService, {
    PersonResponseIdMapDto
} from "./exploration/PersonExplorationApiService";
import PersonCreationApiService from "./creation/PersonCreationApiService";
import PersonApiService from "./PersonApiService";
import PersonRequestDto from "../../../rest/dto/person/PersonRequestDto";
import PersonResponseDto, {
    RelationshipsInfo
} from "../../../rest/dto/person/PersonResponseDto";
import PagedData from "../../../rest/PagedData";
import {FullNameExploration} from "../../../model/human/Human";
import PersonExplorationApiServiceImpl from "./exploration/PersonExplorationApiServiceImpl";
import appConfig from "../../../config/appConfig";
import {buildUrl} from "../../../util/pureFunctions";
import {AxiosInstance} from "axios";
import AxiosApiManager from "../core/AxiosApiManager";
import PersonCreationApiServiceImpl from "./creation/PersonCreationApiServiceImpl";
import {PersonSimpleResponseDto} from "../../../rest/dto/person/PersonSimpleResponseDto";
import {PersonShortResponseDto} from "../../../rest/dto/person/PersonShortResponseDto";

export default class PersonApiServiceImpl implements PersonApiService {
    protected readonly apiInstance: AxiosInstance = AxiosApiManager.globalApiInstance;
    constructor(protected readonly explorationService: PersonExplorationApiService,
                protected readonly creationService: PersonCreationApiService) {
    }

    public static getInstance (explorationService: PersonExplorationApiService = PersonExplorationApiServiceImpl.getInstance(),
                               creationService: PersonCreationApiService = PersonCreationApiServiceImpl.getInstance()): PersonApiServiceImpl {
        return new PersonApiServiceImpl(explorationService, creationService);
    }

    create(requestDto: PersonRequestDto): Promise<PersonResponseDto> {
        return this.creationService.create(requestDto);
    }

    findAll(index: number): Promise<PagedData<PersonSimpleResponseDto>> {
        return this.explorationService.findAll(index);
    }

    findByFullName(fullName: FullNameExploration, i: number): Promise<PagedData<PersonSimpleResponseDto>> {
        return this.explorationService.findByFullName(fullName, i);
    }

    remove(id: number): Promise<any> {
        const url = buildUrl(appConfig.serverMappings.persons.root, id.toString());
        return this.apiInstance.delete(url);
    }

    findById(id: number): Promise<PersonResponseDto | null> {
        return this.explorationService.findById(id);
    }

    findByIdWithDepthOption(id: number, d: number): Promise<PersonResponseDto | null> {
        return this.explorationService.findByIdWithDepthOption(id, d);
    }

    findShortById(id: number): Promise<PersonShortResponseDto | null> {
        return this.explorationService.findSimpleById(id);
    }

    findPersonRelationships(id: number, d: number): Promise<RelationshipsInfo> {
        return this.explorationService.findPersonRelationships(id, d);
    }

    findPersons(idList: Set<number>, d: number): Promise<PersonResponseIdMapDto> {
        return this.explorationService.findPersons(idList, d);
    }

    findSimpleById(id: number): Promise<PersonSimpleResponseDto | null> {
        return this.explorationService.findSimpleById(id);
    }
}