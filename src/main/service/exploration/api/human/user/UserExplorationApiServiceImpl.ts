import UserExplorationApiService from "./UserExplorationApiService";
import {FullName} from "../../../FullName";
import User from "../../../../../model/human/user/User";
import BasicEntityLookupService from "../../BasicExplorationApiService";
import appConfig from "../../../../../config/appConfig";
import BasicApiRequestManager from "../../../../../util/apiRequest/BasicApiRequestManager";
import {HttpMethod} from "../../../../../util/apiRequest/ApiRequestManager";
import PagedData from "../../../../../rest/PagedData";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";
import {isEmpty} from "../../../../../util/isEmpty";

class UserExplorationApiServiceImpl extends HumanExplorationApiServiceImpl<User> implements UserExplorationApiService {

    constructor(getToken: () => string, apiMapping: string = appConfig.serverMappings.users) {
        super(apiMapping, getToken);
    }

}

export default UserExplorationApiServiceImpl;