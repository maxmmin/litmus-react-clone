import PersonExplorationApiService from "../../exploration/api/human/person/PersonExplorationApiService";
import PersonCreationApiService from "../../creation/api/PersonCreationApiService";
import PersonApiService from "./PersonApiService";
import PersonRequestDto from "../../../rest/dto/person/PersonRequestDto";
import PersonResponseDto, {
    RelationshipsInfo,
    SimplePersonResponseDto
} from "../../../rest/dto/person/PersonResponseDto";
import PagedData from "../../../rest/PagedData";
import {FullNameExploration} from "../../../model/human/Human";
import PersonExplorationApiServiceImpl, {PersonResponseIdMapDto} from "../../exploration/api/human/person/PersonExplorationApiServiceImpl";
import appConfig from "../../../config/appConfig";
import {buildUrl} from "../../../util/pureFunctions";
import {AxiosInstance} from "axios";
import AxiosApiManager from "../../rest/AxiosApiManager";
import PersonCreationApiServiceImpl from "../../creation/api/PersonCreationApiServiceImpl";

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

    findAll(index: number): Promise<PagedData<PersonResponseDto>> {
        return this.explorationService.findAll(index);
    }

    findByFullName(fullName: FullNameExploration, i: number): Promise<PagedData<PersonResponseDto>> {
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

    findPersonRelationships(id: number, d: number): Promise<RelationshipsInfo> {
        return this.explorationService.findPersonRelationships(id, d);
    }

    findPersonSimpleDto(id: number): Promise<SimplePersonResponseDto | null> {
        return this.explorationService.findPersonSimpleDto(id);
    }

    findPersons(idList: Set<number>, d: number): Promise<PersonResponseIdMapDto> {
        return this.explorationService.findPersons(idList, d);
    }


}