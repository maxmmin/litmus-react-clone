import ApiRequestManager, {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import appConfig from "../../../config/appConfig";
import {HttpErrorParser} from "../../../error/BasicHttpError";
import CreationApiService from "./CreationApiService";
import JurPersonRequestDto from "../../../rest/dto/jurPerson/JurPersonRequestDto";
import JurPersonResponseDto from "../../../rest/dto/jurPerson/JurPersonResponseDto";
import AuthenticationStateManager from "../../auth/stateManager/AuthenticationStateManager";
import AuthenticationStateManagerImpl from "../../auth/stateManager/AuthenticationStateManagerImpl";
import axiosApiInstance from "../../../config/axiosApiInstance";
import {AxiosResponse} from "axios/index";


class JurPersonCreationApiService implements CreationApiService<JurPersonRequestDto, JurPersonResponseDto> {


    public static getInstance (): JurPersonCreationApiService {
        return new JurPersonCreationApiService();
    }

    async create(creationDto: JurPersonRequestDto): Promise<JurPersonResponseDto> {

        const response = await axiosApiInstance.post<JurPersonRequestDto, AxiosResponse<JurPersonResponseDto>>(appConfig.serverMappings.jurPersons, creationDto);

        return response.data;
    }
}

export default JurPersonCreationApiService;