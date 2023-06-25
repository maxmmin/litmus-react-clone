import UserExplorationApiService from "./UserExplorationApiService";
import appConfig from "../../../../../config/appConfig";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";
import UserResponseDto from "../../../../../rest/dto/user/UserResponseDto";
import AuthenticationStateManager from "../../../../auth/stateManager/AuthenticationStateManager";
import AuthenticationStateManagerImpl from "../../../../auth/stateManager/AuthenticationStateManagerImpl";


class UserExplorationApiServiceImpl extends HumanExplorationApiServiceImpl<UserResponseDto> implements UserExplorationApiService {

    constructor(authStateManager: AuthenticationStateManager) {
        super(()=>authStateManager.getAuth()!.accessToken, appConfig.serverMappings.users);
    }

    public static getInstance (authStateManager: AuthenticationStateManager = new AuthenticationStateManagerImpl()): UserExplorationApiServiceImpl {
        return new UserExplorationApiServiceImpl(authStateManager);
    }

}

export default UserExplorationApiServiceImpl;