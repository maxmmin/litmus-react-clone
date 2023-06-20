import PersonExplorationApiService from "./PersonExplorationApiService";
import appConfig from "../../../../../config/appConfig";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";
import PersonResponseDto from "../../../../../rest/dto/person/PersonResponseDto";

class PersonExplorationApiServiceImpl extends HumanExplorationApiServiceImpl<PersonResponseDto> implements PersonExplorationApiService {

    constructor(getToken: () => string, apiMapping: string = appConfig.serverMappings.persons) {
        super(apiMapping, getToken);
    }

}

export default PersonExplorationApiServiceImpl;