import PersonExplorationApiService from "./PersonExplorationApiService";
import Person from "../../../../../model/human/person/Person";
import appConfig from "../../../../../config/appConfig";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";

class PersonExplorationApiServiceImpl extends HumanExplorationApiServiceImpl<Person> implements PersonExplorationApiService {

    constructor(getToken: () => string, apiMapping: string = appConfig.serverMappings.persons) {
        super(apiMapping, getToken);
    }

}

export default PersonExplorationApiServiceImpl;