import UserIdentity from "../../redux/userIdentity/UserIdentity";

interface UserIdentityService {
    retrieveIdentity (): Promise<UserIdentity>
}

export default UserIdentityService;