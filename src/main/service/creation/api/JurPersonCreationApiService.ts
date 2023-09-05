import ApiRequestManager, {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import appConfig from "../../../config/appConfig";
import {HttpErrorParser} from "../../../error/BasicHttpError";
import CreationApiService from "./CreationApiService";
import JurPersonRequestDto from "../../../rest/dto/jurPerson/JurPersonRequestDto";
import JurPersonResponseDto from "../../../rest/dto/jurPerson/JurPersonResponseDto";
import axiosApiInstance from "../../rest/AxiosApiManager";
import {AxiosResponse} from "axios";


class JurPersonCreationApiService implements CreationApiService<JurPersonRequestDto, JurPersonResponseDto> {

    protected readonly apiInstance = axiosApiInstance.globalApiInstance;

    public static getInstance (): JurPersonCreationApiService {
        return new JurPersonCreationApiService();
    }

    async create(creationDto: JurPersonRequestDto): Promise<JurPersonResponseDto> {

        const response = await this.apiInstance.post<JurPersonRequestDto, AxiosResponse<JurPersonResponseDto>>(appConfig.serverMappings.jurPersons, creationDto);

        return response.data;
    }
}

export default JurPersonCreationApiService;