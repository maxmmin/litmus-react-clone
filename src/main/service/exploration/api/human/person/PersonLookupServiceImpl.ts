import PersonLookupService from "./PersonLookupService";
import Person from "../../../../../model/human/person/Person";
import appConfig from "../../../../../config/appConfig";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";

class PersonLookupServiceImpl extends HumanExplorationApiServiceImpl<Person> implements PersonLookupService {

    constructor(getToken: () => string, apiMapping: string = appConfig.serverMappings.persons) {
        super(apiMapping, getToken);
    }

}

export default PersonLookupServiceImpl;