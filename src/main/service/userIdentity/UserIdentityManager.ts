import UserIdentity from "../../redux/userIdentity/UserIdentity";

interface UserIdentityManager {
    retrieveIdentity (globalPending: boolean): void;
}

export default UserIdentityManager;