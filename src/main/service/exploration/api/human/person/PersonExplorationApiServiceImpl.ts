import PersonExplorationApiService from "./PersonExplorationApiService";
import appConfig from "../../../../../config/appConfig";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";
import PersonResponseDto from "../../../../../rest/dto/person/PersonResponseDto";
import AuthenticationStateManager from "../../../../auth/stateManager/AuthenticationStateManager";
import {inject, injectable} from "inversify";
import IOC_TYPES from "../../../../../inversify/IOC_TYPES";

@injectable()
class PersonExplorationApiServiceImpl extends HumanExplorationApiServiceImpl<PersonResponseDto> implements PersonExplorationApiService {

    constructor(@inject(IOC_TYPES.AuthStateManager) authStateManager: AuthenticationStateManager) {
        super(()=>authStateManager.getAuth()!.accessToken, appConfig.serverMappings.persons);
    }

}

export default PersonExplorationApiServiceImpl;