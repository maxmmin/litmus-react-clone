import UserIdentityApiService from "./UserIdentityApiService";
import appConfig from "../../../config/appConfig";
import {AxiosInstance} from "axios";
import AxiosApiManager from "../../rest/AxiosApiManager";
import UserIdentityDtoMapper from "../../dtoMappers/userIdentity/UserIdentityDtoMapper";
import UserIdentityDtoMapperImpl from "../../dtoMappers/userIdentity/UserIdentityDtoMapperImpl";
import UserIdentityResponseDto from "../../../rest/dto/UserIdentityResponseDto";


class UserIdentityApiServiceImpl implements UserIdentityApiService {

    protected readonly apiInstance: AxiosInstance = AxiosApiManager.globalApiInstance;

    constructor(protected readonly dtoMapper: UserIdentityDtoMapper) {
    }

    public static getInstance(
        dtoMapper: UserIdentityDtoMapper = UserIdentityDtoMapperImpl.getInstance()
    ): UserIdentityApiServiceImpl {
        return new UserIdentityApiServiceImpl(dtoMapper);
    }

    async retrieveIdentity (): Promise<UserIdentityResponseDto> {
        const response = await this.apiInstance
            .get<UserIdentityResponseDto>(appConfig.serverMappings.auth.getCurrentUser);
        return response.data;
    }
}

export default UserIdentityApiServiceImpl;