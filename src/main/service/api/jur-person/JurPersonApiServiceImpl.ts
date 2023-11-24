import JurPersonApiService from "./JurPersonApiService";
import JurPersonRequestDto from "../../../rest/dto/jurPerson/JurPersonRequestDto";
import PagedData from "../../../rest/PagedData";
import JurPersonResponseDto from "../../../rest/dto/jurPerson/JurPersonResponseDto";
import JurPersonExplorationApiService from "../../exploration/api/jurPerson/JurPersonExplorationApiService";
import JurPersonCreationApiService from "../../creation/api/JurPersonCreationApiService";
import {AxiosInstance} from "axios";
import AxiosApiManager from "../../rest/AxiosApiManager";
import {buildUrl} from "../../../util/pureFunctions";
import appConfig from "../../../config/appConfig";
import JurPersonExplorationApiServiceImpl from "../../exploration/api/jurPerson/JurPersonExplorationApiServiceImpl";
import JurPersonCreationApiServiceImpl from "../../creation/api/JurPersonCreationApiServiceImpl";
import {JurPersonSimpleResponseDto} from "../../../rest/dto/jurPerson/JurPersonSimpleResponseDto";
import jurPersonExplorationService from "../../exploration/JurPersonExplorationService";
import jurPersonCreationService from "../../creation/JurPersonCreationService";
import {JurPersonShortRequestDto} from "../../../rest/dto/jurPerson/JurPersonShortRequestDto";

export default class JurPersonApiServiceImpl implements JurPersonApiService {
    protected readonly apiInstance: AxiosInstance = AxiosApiManager.globalApiInstance;

    public static getInstance (jurPersonExplorationService: JurPersonExplorationApiService = JurPersonExplorationApiServiceImpl.getInstance(),
                               jurPersonCreationService: JurPersonCreationApiService = JurPersonCreationApiServiceImpl.getInstance()): JurPersonApiServiceImpl {
        return new JurPersonApiServiceImpl(jurPersonExplorationService, jurPersonCreationService);
    }

    constructor(protected readonly jurPersonExplorationService: JurPersonExplorationApiService,
                protected readonly jurPersonCreationService: JurPersonCreationApiService
                ) {
    }

    create(requestDto: JurPersonRequestDto): Promise<JurPersonResponseDto> {
        return this.jurPersonCreationService.create(requestDto);
    }

    findAll(index: number): Promise<PagedData<JurPersonSimpleResponseDto>> {
        return this.jurPersonExplorationService.findAll(index);
    }

    findSimpleById(id: number): Promise<JurPersonSimpleResponseDto | null> {
        return this.jurPersonExplorationService.findSimpleById(id);
    }

    findShortById(id: number): Promise<JurPersonShortRequestDto | null> {
        return this.jurPersonExplorationService.findShortById(id);
    }

    findById(id: number): Promise<JurPersonResponseDto | null> {
        return this.jurPersonExplorationService.findById(id);
    }

    findByIdWithDepthOption(id: number, d: number): Promise<JurPersonResponseDto | null> {
        return this.jurPersonExplorationService.findByIdWithDepthOption(id, d);
    }

    findByName(name: string, i: number): Promise<PagedData<JurPersonSimpleResponseDto>> {
        return this.jurPersonExplorationService.findByName(name, i);
    }

    remove(id: number): Promise<any> {
       const url = buildUrl(appConfig.serverMappings.jurPersons.root, id.toString());
       return this.apiInstance.delete(url);
    }

}