import UserIdentity from "../../../model/userIdentity/UserIdentity";

interface UserIdentityManager {
    retrieveIdentity (globalPending: boolean): Promise<UserIdentity>;
    clearIdentity (): Promise<void>;
}

export default UserIdentityManager;