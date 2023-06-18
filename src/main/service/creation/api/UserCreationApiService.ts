import {UserCreationParams} from "../../../redux/actions/CreationCoreActions";
import ApiRequestManager, {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import appConfig from "../../../config/appConfig";
import {BasicHttpError} from "../../../error/BasicHttpError";
import User from "../../../model/human/user/User";
import CreationApiService from "./CreationApiService";

class UserCreationApiService implements CreationApiService<User, UserCreationParams> {
    private readonly getAccessToken: ()=>string;

    constructor(getAccessToken: () => string) {
        this.getAccessToken = getAccessToken;
    }

    async create(params: UserCreationParams): Promise<User> {
        const apiRequestManager: ApiRequestManager = new BasicApiRequestManager();

        const accessToken = this.getAccessToken();

        const response: Response = await apiRequestManager
            .url(appConfig.serverMappings.users)
            .method(HttpMethod.POST)
            .body(JSON.stringify(params))
            .authentication(accessToken)
            .fetch();

        if (response.ok) {
            return await response.json() as User;
        } else {
            throw await BasicHttpError.parseResponse(response);
        }
    }
}

export default UserCreationApiService;