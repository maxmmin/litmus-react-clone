import UserExplorationApiService from "./UserExplorationApiService";
import appConfig from "../../../../../config/appConfig";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";
import UserResponseDto from "../../../../../rest/dto/user/UserResponseDto";

class UserExplorationApiServiceImpl extends HumanExplorationApiServiceImpl<UserResponseDto> implements UserExplorationApiService {

    constructor(getToken: () => string, apiMapping: string = appConfig.serverMappings.users) {
        super(apiMapping, getToken);
    }

}

export default UserExplorationApiServiceImpl;