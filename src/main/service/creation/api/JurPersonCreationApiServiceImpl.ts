import appConfig from "../../../config/appConfig";
import CreationApiService from "./CreationApiService";
import JurPersonRequestDto from "../../../rest/dto/jurPerson/JurPersonRequestDto";
import JurPersonResponseDto from "../../../rest/dto/jurPerson/JurPersonResponseDto";
import axiosApiInstance from "../../rest/AxiosApiManager";
import {AxiosResponse} from "axios";
import JurPersonCreationApiService from "./JurPersonCreationApiService";


class JurPersonCreationApiServiceImpl implements JurPersonCreationApiService {

    protected readonly apiInstance = axiosApiInstance.globalApiInstance;

    public static getInstance (): JurPersonCreationApiServiceImpl {
        return new JurPersonCreationApiServiceImpl();
    }

    async create(creationDto: JurPersonRequestDto): Promise<JurPersonResponseDto> {

        const response = await this.apiInstance.post<JurPersonRequestDto, AxiosResponse<JurPersonResponseDto>>(appConfig.serverMappings.jurPersons.root, creationDto);

        return response.data;
    }
}

export default JurPersonCreationApiServiceImpl;