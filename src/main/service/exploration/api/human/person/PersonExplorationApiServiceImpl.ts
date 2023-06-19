import PersonExplorationApiService from "./PersonExplorationApiService";
import Person from "../../../../../model/human/person/Person";
import appConfig from "../../../../../config/appConfig";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";
import {FullName} from "../../../FullName";
import PagedData from "../../../../../rest/PagedData";
import PersonResponseDto from "../../../../../rest/dto/person/PersonResponseDto";

class PersonExplorationApiServiceImpl extends HumanExplorationApiServiceImpl<PersonResponseDto> implements PersonExplorationApiService {

    constructor(getToken: () => string, apiMapping: string = appConfig.serverMappings.persons) {
        super(apiMapping, getToken);
    }

    // @todo !!!!!!! write also dto which i got from the server and use them

}

export default PersonExplorationApiServiceImpl;