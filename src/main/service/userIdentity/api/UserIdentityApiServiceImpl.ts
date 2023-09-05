import UserIdentity from "../../../redux/types/userIdentity/UserIdentity";
import UserIdentityApiService from "./UserIdentityApiService";
import appConfig from "../../../config/appConfig";
import Role from "../../../redux/types/userIdentity/Role";
import {AxiosInstance} from "axios";
import AxiosApiManager from "../../rest/AxiosApiManager";


class UserIdentityApiServiceImpl implements UserIdentityApiService {

    protected readonly apiInstance: AxiosInstance = AxiosApiManager.globalApiInstance;

    constructor() {
    }

    public static getInstance(): UserIdentityApiServiceImpl {
        return new UserIdentityApiServiceImpl();
    }

    async retrieveIdentity (): Promise<UserIdentity> {
        const response = await this.apiInstance
            .get<UserIdentity>(appConfig.serverMappings.getCurrentUser);

        const identity: UserIdentity = response.data;

        const role = Role[identity.role];
        if (!role) {
            throw new Error("Invalid role. Contact developers to solve this issue");
        }
        return {...identity, role: role.role, permissions: role.permissions }
    }
}

export default UserIdentityApiServiceImpl;