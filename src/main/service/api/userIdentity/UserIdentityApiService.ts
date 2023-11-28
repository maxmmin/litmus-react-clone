import UserIdentity from "../../../redux/types/userIdentity/UserIdentity";

interface UserIdentityApiService {
    retrieveIdentity (): Promise<UserIdentity>
}

export default UserIdentityApiService;