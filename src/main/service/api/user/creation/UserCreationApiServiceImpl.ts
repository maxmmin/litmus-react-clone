import appConfig from "../../../../config/appConfig";
import UserRequestDto from "../../../../rest/dto/user/UserRequestDto";
import UserResponseDto from "../../../../rest/dto/user/UserResponseDto";
import {AxiosResponse} from "axios";
import AxiosApiManager from "../../core/AxiosApiManager";
import UserCreationApiService from "./UserCreationApiService";

class UserCreationApiServiceImpl implements UserCreationApiService {
    protected readonly apiInstance = AxiosApiManager.globalApiInstance;

    constructor() {
    }

    public static getInstance (): UserCreationApiServiceImpl {
        return new UserCreationApiServiceImpl();
    }

    async create(dto: UserRequestDto): Promise<UserResponseDto> {
        const response = await this.apiInstance
            .post<UserRequestDto, AxiosResponse<UserResponseDto>>(appConfig.serverMappings.users.root,
                dto);

        return response.data;
    }
}

export default UserCreationApiServiceImpl;