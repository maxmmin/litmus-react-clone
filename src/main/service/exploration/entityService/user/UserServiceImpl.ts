import UserService from "./UserService";
import {FullName} from "../../FullName";
import User from "../../../../model/human/user/User";
import BasicEntityService from "../BasicEntityService";
import appConfig from "../../../../config/appConfig";
import BasicApiRequestManager from "../../../../util/apiRequest/BasicApiRequestManager";
import {HttpMethod} from "../../../../util/apiRequest/ApiRequestManager";
import {isEmpty} from "../../../../util/pureFunctions";
import PagedData from "../PagedData";
import BasicHumanService from "../human/BasicHumanService";

class UserServiceImpl extends BasicHumanService<User> implements UserService {

    constructor(getToken: () => string, apiMapping: string = appConfig.serverMappings.users) {
        super(apiMapping, getToken);
    }

}

export default UserServiceImpl;