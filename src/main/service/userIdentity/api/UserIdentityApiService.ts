import UserIdentity from "../../../redux/userIdentity/UserIdentity";

interface UserIdentityApiService {
    retrieveIdentity (): Promise<UserIdentity>
}

export default UserIdentityApiService;