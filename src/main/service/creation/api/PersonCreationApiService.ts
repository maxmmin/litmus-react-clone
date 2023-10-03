import appConfig from "../../../config/appConfig";
import CreationApiService from "./CreationApiService";
import PersonRequestDto from "../../../rest/dto/person/PersonRequestDto";
import PersonResponseDto from "../../../rest/dto/person/PersonResponseDto";
import MediaEntityFormDataBuilder from "./multipartBuilder/MediaEntityFormDataBuilder";
import MediaEntityFormDataBuilderImpl from "./multipartBuilder/MediaEntityFormDataBuilderImpl";
import {AxiosResponse} from "axios";
import {AxiosInstance} from "axios";
import AxiosApiManager from "../../rest/AxiosApiManager";

class PersonCreationApiService implements CreationApiService<PersonRequestDto, PersonResponseDto> {

    protected readonly apiInstance: AxiosInstance = AxiosApiManager.globalApiInstance;
    constructor(private readonly formDataBuilder: MediaEntityFormDataBuilder) {
    }

    public static getInstance (formDataBuilder: MediaEntityFormDataBuilder = MediaEntityFormDataBuilderImpl.getInstance()): PersonCreationApiService {
        return new PersonCreationApiService(formDataBuilder);
    }

    async create(dto: PersonRequestDto): Promise<PersonResponseDto> {

        const media = dto.media;

        delete dto.media;

        const formData = this.formDataBuilder.buildFormData(dto, media?media:null);

        const response = await this.apiInstance.post<FormData, AxiosResponse<PersonResponseDto>>(
            appConfig.serverMappings.persons.root,
            formData
        );

        return response.data;
    }
}

export default PersonCreationApiService;