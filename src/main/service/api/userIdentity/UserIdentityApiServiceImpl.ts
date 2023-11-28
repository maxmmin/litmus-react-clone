import UserIdentity from "../../../redux/types/userIdentity/UserIdentity";
import UserIdentityApiService from "./UserIdentityApiService";
import appConfig from "../../../config/appConfig";
import Role from "../../../redux/types/userIdentity/Role";
import {AxiosInstance} from "axios";
import AxiosApiManager from "../../rest/AxiosApiManager";
import UserResponseDto from "../../../rest/dto/user/UserResponseDto";
import UserIdentityDtoMapper from "../../../rest/dto/dtoMappers/UserIdentityDtoMapper";
import UserDtoMapperImpl from "../../../rest/dto/dtoMappers/UserDtoMapperImpl";
import UserIdentityDtoMapperImpl from "../../../rest/dto/dtoMappers/UserIdentityDtoMapperImpl";
import UserIdentityResponseDto from "../../../rest/dto/UserIdentityResponseDto";


class UserIdentityApiServiceImpl implements UserIdentityApiService {

    protected readonly apiInstance: AxiosInstance = AxiosApiManager.globalApiInstance;

    constructor(protected readonly dtoMapper: UserIdentityDtoMapper) {
    }

    public static getInstance(dtoMapper: UserIdentityDtoMapper = new UserIdentityDtoMapperImpl()): UserIdentityApiServiceImpl {
        return new UserIdentityApiServiceImpl(dtoMapper);
    }

    async retrieveIdentity (): Promise<UserIdentity> {
        const response = await this.apiInstance
            .get<UserIdentityResponseDto>(appConfig.serverMappings.auth.getCurrentUser);

        return this.dtoMapper.mapToIdentity(response.data);
    }
}

export default UserIdentityApiServiceImpl;