import appConfig from "../../../../config/appConfig";
import JurPersonRequestDto from "../../../../rest/dto/jurPerson/JurPersonRequestDto";
import JurPersonResponseDto from "../../../../rest/dto/jurPerson/JurPersonResponseDto";
import axiosApiInstance from "../../core/AxiosApiManager";
import {AxiosResponse} from "axios";
import JurPersonCreationApiService from "./JurPersonCreationApiService";
import MediaEntityFormDataBuilder from "../../../multipartBuilder/MediaEntityFormDataBuilder";
import MediaEntityFormDataBuilderImpl from "../../../multipartBuilder/MediaEntityFormDataBuilderImpl";


class JurPersonCreationApiServiceImpl implements JurPersonCreationApiService {

    protected readonly apiInstance = axiosApiInstance.globalApiInstance;

    protected readonly formDataBuilder: MediaEntityFormDataBuilder;


    constructor(formDataBuilder: MediaEntityFormDataBuilder) {
        this.formDataBuilder = formDataBuilder;
    }

    public static getInstance (formDataBuilder: MediaEntityFormDataBuilder = MediaEntityFormDataBuilderImpl.getInstance()): JurPersonCreationApiServiceImpl {
        return new JurPersonCreationApiServiceImpl(formDataBuilder);
    }

    async create(dto: JurPersonRequestDto): Promise<JurPersonResponseDto> {
        const media = dto.media;

        delete dto.media;

        const formData = this.formDataBuilder.buildFormData(dto, media?media:null);

        const response = await this.apiInstance.post<FormData, AxiosResponse<JurPersonResponseDto>>(
            appConfig.serverMappings.jurPersons.root,
            formData
        );

        return response.data;
    }
}

export default JurPersonCreationApiServiceImpl;