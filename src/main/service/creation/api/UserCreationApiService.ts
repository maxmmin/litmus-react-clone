import ApiRequestManager, {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import appConfig from "../../../config/appConfig";
import {BasicHttpError} from "../../../error/BasicHttpError";
import CreationApiService from "./CreationApiService";
import UserRequestDto from "../../../rest/dto/user/UserRequestDto";
import UserResponseDto from "../../../rest/dto/user/UserResponseDto";
import {inject} from "inversify";
import IOC_TYPES from "../../../inversify/IOC_TYPES";
import AuthenticationStateManager from "../../auth/stateManager/AuthenticationStateManager";

class UserCreationApiService implements CreationApiService<UserRequestDto, UserResponseDto> {
    private readonly getAccessToken: ()=>string;

    constructor(@inject(IOC_TYPES.auth.AuthStateManager) authManager: AuthenticationStateManager) {
        this.getAccessToken = ()=>authManager.getAuth()!.accessToken;
    }

    async create(dto: UserRequestDto): Promise<UserResponseDto> {
        const apiRequestManager: ApiRequestManager = new BasicApiRequestManager();

        const accessToken = this.getAccessToken();

        const response: Response = await apiRequestManager
            .url(appConfig.serverMappings.users)
            .method(HttpMethod.POST)
            .body(JSON.stringify(dto))
            .authentication(accessToken)
            .fetch();

        if (response.ok) {
            return await response.json() as UserResponseDto;
        } else {
            throw await BasicHttpError.parseResponse(response);
        }
    }
}

export default UserCreationApiService;