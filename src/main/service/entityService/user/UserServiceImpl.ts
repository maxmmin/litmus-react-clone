import UserService from "./UserService";
import {FullName} from "../../exploration/FullName";
import User from "../../../model/human/user/User";
import BasicEntityService from "../BasicEntityService";
import appConfig from "../../../config/appConfig";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import {isEmpty} from "../../../util/pureFunctions";
import PagedResponse from "../PagedResponse";
import BasicHumanService from "../human/BasicHumanService";

class UserServiceImpl extends BasicHumanService<User> implements UserService {

    constructor(getToken: () => string, apiMapping: string = appConfig.serverMappings.users) {
        super(apiMapping, getToken);
    }

}

export default UserServiceImpl;