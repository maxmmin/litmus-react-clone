import UserService from "./UserService";
import {FullName} from "../../exploration/FullName";
import User from "../../../model/user/User";
import BasicEntityService from "../BasicEntityService";
import appConfig from "../../../config/appConfig";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import {isEmpty} from "../../../util/pureFunctions";

class UserServiceImpl extends BasicEntityService<User> implements UserService {

    constructor(getToken: () => string, apiMapping: string = appConfig.serverMappings.users) {
        super(apiMapping, getToken);
    }

    async findByFullName(fullName: FullName): Promise<User[]> {
        const requestManager = new BasicApiRequestManager();

        const accessToken = this.getAccessToken();

        requestManager
            .url(this.apiUrl)
            .method(HttpMethod.GET)
            .authentication(accessToken);

        for (const key in fullName) {
            if (Object.hasOwn(fullName, key)&&!isEmpty(fullName[key])) {
                requestManager.setQueryParam(key,fullName[key]);
            }
        }
        const response = await requestManager.fetch();
        return await response.json() as User[];
    }


}

export default UserServiceImpl;