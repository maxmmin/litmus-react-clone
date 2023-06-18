import UserIdentity from "../../../redux/types/userIdentity/UserIdentity";
import UserIdentityApiService from "./UserIdentityApiService";
import {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import appConfig from "../../../config/appConfig";
import {BasicHttpError} from "../../../error/BasicHttpError";
import Role from "../../../redux/types/userIdentity/Role";

class UserIdentityApiServiceImpl implements UserIdentityApiService {

    getToken: ()=>string;

    constructor(getToken: ()=>string) {
        this.getToken = getToken;
    }

    async retrieveIdentity (): Promise<UserIdentity> {
        const accessToken = this.getToken();

        const response: Response = await new BasicApiRequestManager()
            .url(appConfig.serverMappings.getCurrentUser)
            .method(HttpMethod.GET)
            .authentication(accessToken)
            .fetch();

        if (response.ok) {
            const identity: UserIdentity = await response.json();
            const role = Role[identity.role];
            if (!role) {
                throw new Error("Invalid role. Contact developers to solve this issue");
            }
            return {...identity, role: role.role, permissions: role.permissions }
        } else {
            throw await BasicHttpError.parseResponse(response);
        }
    }
}

export default UserIdentityApiServiceImpl;