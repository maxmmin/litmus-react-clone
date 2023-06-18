import UserIdentity from "../../redux/types/userIdentity/UserIdentity";

interface UserIdentityManager {
    retrieveIdentity (globalPending: boolean): void;
}

export default UserIdentityManager;