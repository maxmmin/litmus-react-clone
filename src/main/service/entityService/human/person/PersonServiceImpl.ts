import PersonService from "./PersonService";
import Person from "../../../../model/human/person/Person";
import appConfig from "../../../../config/appConfig";
import BasicHumanService from "../BasicHumanService";

class PersonServiceImpl extends BasicHumanService<Person> implements PersonService {

    constructor(getToken: () => string, apiMapping: string = appConfig.serverMappings.persons) {
        super(apiMapping, getToken);
    }

}

export default PersonServiceImpl;