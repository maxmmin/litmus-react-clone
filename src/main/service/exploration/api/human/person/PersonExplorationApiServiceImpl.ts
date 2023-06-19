import PersonExplorationApiService from "./PersonExplorationApiService";
import Person from "../../../../../model/human/person/Person";
import appConfig from "../../../../../config/appConfig";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";
import {FullName} from "../../../FullName";
import PagedData from "../../../../../rest/PagedData";

class PersonExplorationApiServiceImpl extends HumanExplorationApiServiceImpl<Person> implements PersonExplorationApiService {

    constructor(getToken: () => string, apiMapping: string = appConfig.serverMappings.persons) {
        super(apiMapping, getToken);
    }

    // @todo !!!!!!! write also dto which i got from the server and use them

}

export default PersonExplorationApiServiceImpl;