import UserIdentityResponseDto from "../../../rest/dto/UserIdentityResponseDto";

interface UserIdentityApiService {
    retrieveIdentity (): Promise<UserIdentityResponseDto>
}

export default UserIdentityApiService;