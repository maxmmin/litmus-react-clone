import UserExplorationApiService from "./UserExplorationApiService";
import appConfig from "../../../../../config/appConfig";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";
import UserResponseDto from "../../../../../rest/dto/user/UserResponseDto";
import AuthenticationStateManager from "../../../../auth/stateManager/AuthenticationStateManager";
import AuthenticationStateManagerImpl from "../../../../auth/stateManager/AuthenticationStateManagerImpl";
import {buildUrl} from "../../../../../util/pureFunctions";


class UserExplorationApiServiceImpl extends HumanExplorationApiServiceImpl<UserResponseDto> implements UserExplorationApiService {

    constructor() {
        super(appConfig.serverMappings.users.root);
    }

    public static getInstance (): UserExplorationApiServiceImpl {
        return new UserExplorationApiServiceImpl();
    }

    async findByEmail(email: string): Promise<UserResponseDto|null> {
        const response = await this.apiInstance.get<UserResponseDto>(buildUrl(appConfig.serverMappings.users.getByEmail, encodeURIComponent(email)));
        return Object.keys(response.data).length>0?response.data:null;
    }


}

export default UserExplorationApiServiceImpl;