import PersonExplorationApiService from "./PersonExplorationApiService";
import appConfig from "../../../../../config/appConfig";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";
import PersonResponseDto from "../../../../../rest/dto/person/PersonResponseDto";
import AuthenticationStateManager from "../../../../auth/stateManager/AuthenticationStateManager";
import AuthenticationStateManagerImpl from "../../../../auth/stateManager/AuthenticationStateManagerImpl";

class PersonExplorationApiServiceImpl extends HumanExplorationApiServiceImpl<PersonResponseDto> implements PersonExplorationApiService {

    constructor(authStateManager: AuthenticationStateManager) {
        super(()=>authStateManager.getAuth()!.accessToken, appConfig.serverMappings.persons);
    }

    public static getInstance (authStateManager: AuthenticationStateManager = new AuthenticationStateManagerImpl()): PersonExplorationApiServiceImpl {
        return new PersonExplorationApiServiceImpl(authStateManager);
    }

}

export default PersonExplorationApiServiceImpl;