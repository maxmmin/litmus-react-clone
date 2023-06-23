import UserExplorationApiService from "./UserExplorationApiService";
import appConfig from "../../../../../config/appConfig";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";
import UserResponseDto from "../../../../../rest/dto/user/UserResponseDto";
import {inject, injectable} from "inversify";
import IOC_TYPES from "../../../../../inversify/IOC_TYPES";
import AuthenticationStateManager from "../../../../auth/stateManager/AuthenticationStateManager";

@injectable()
class UserExplorationApiServiceImpl extends HumanExplorationApiServiceImpl<UserResponseDto> implements UserExplorationApiService {

    constructor(@inject(IOC_TYPES.auth.AuthStateManager) private readonly _authStateManager: AuthenticationStateManager) {
        super(()=>_authStateManager.getAuth()!.accessToken, appConfig.serverMappings.users);
    }

}

export default UserExplorationApiServiceImpl;