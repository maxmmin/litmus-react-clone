import PersonExplorationApiService from "./PersonExplorationApiService";
import appConfig from "../../../../../config/appConfig";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";
import PersonResponseDto from "../../../../../rest/dto/person/PersonResponseDto";
import AuthenticationStateManager from "../../../../auth/stateManager/AuthenticationStateManager";
import AuthenticationStateManagerImpl from "../../../../auth/stateManager/AuthenticationStateManagerImpl";

class PersonExplorationApiServiceImpl extends HumanExplorationApiServiceImpl<PersonResponseDto> implements PersonExplorationApiService {

    constructor() {
        super(appConfig.serverMappings.persons);
    }

    public static getInstance (): PersonExplorationApiServiceImpl {
        return new PersonExplorationApiServiceImpl();
    }

}

export default PersonExplorationApiServiceImpl;