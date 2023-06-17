import UserLookupService from "./UserLookupService";
import {FullName} from "../../../FullName";
import User from "../../../../../model/human/user/User";
import BasicEntityLookupService from "../../BasicExplorationApiService";
import appConfig from "../../../../../config/appConfig";
import BasicApiRequestManager from "../../../../../util/apiRequest/BasicApiRequestManager";
import {HttpMethod} from "../../../../../util/apiRequest/ApiRequestManager";
import {isEmpty} from "../../../../../util/pureFunctions";
import PagedData from "../../../../../util/apiRequest/PagedData";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";

class UserLookupServiceImpl extends HumanExplorationApiServiceImpl<User> implements UserLookupService {

    constructor(getToken: () => string, apiMapping: string = appConfig.serverMappings.users) {
        super(apiMapping, getToken);
    }

}

export default UserLookupServiceImpl;