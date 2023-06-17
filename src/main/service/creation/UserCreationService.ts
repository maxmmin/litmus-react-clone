import {UserCreationParams} from "../../redux/creation/CreationCoreActions";
import ApiRequestManager, {HttpMethod} from "../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../util/apiRequest/BasicApiRequestManager";
import appConfig from "../../config/appConfig";
import {BasicHttpError} from "../../util/apiRequest/BasicHttpError";
import User from "../../model/human/user/User";
import CreationService from "./CreationService";

class UserCreationService implements CreationService<User, UserCreationParams> {
    async create(params: UserCreationParams): Promise<User> {
        const apiRequestManager: ApiRequestManager = new BasicApiRequestManager();

        const response: Response = await apiRequestManager
            .url(appConfig.serverMappings.users)
            .method(HttpMethod.POST)
            .body(JSON.stringify(params))
            .fetch();

        if (response.ok) {
            return await response.json() as User;
        } else {
            throw await BasicHttpError.parseResponse(response);
        }
    }
}

export default UserCreationService;