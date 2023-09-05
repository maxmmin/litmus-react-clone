import appConfig from "../../../config/appConfig";
import CreationApiService from "./CreationApiService";
import UserRequestDto from "../../../rest/dto/user/UserRequestDto";
import UserResponseDto from "../../../rest/dto/user/UserResponseDto";
import {AxiosResponse} from "axios";
import AxiosApiManager from "../../rest/AxiosApiManager";

class UserCreationApiService implements CreationApiService<UserRequestDto, UserResponseDto> {
    protected readonly apiInstance = AxiosApiManager.globalApiInstance;

    constructor() {
    }

    public static getInstance (): UserCreationApiService {
        return new UserCreationApiService();
    }

    async create(dto: UserRequestDto): Promise<UserResponseDto> {
        const response = await this.apiInstance
            .post<UserRequestDto, AxiosResponse<UserResponseDto>>(appConfig.serverMappings.users,
                dto);

        return response.data;
    }
}

export default UserCreationApiService;