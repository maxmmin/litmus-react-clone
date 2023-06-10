import PersonLookupService from "./PersonLookupService";
import Person from "../../../../../model/human/person/Person";
import appConfig from "../../../../../config/appConfig";
import HumanLookupServiceImpl from "../HumanLookupServiceImpl";

class PersonLookupServiceImpl extends HumanLookupServiceImpl<Person> implements PersonLookupService {

    constructor(getToken: () => string, apiMapping: string = appConfig.serverMappings.persons) {
        super(apiMapping, getToken);
    }

}

export default PersonLookupServiceImpl;