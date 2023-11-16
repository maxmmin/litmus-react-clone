import HumanExplorationApiService from "../HumanExplorationApiService";
import UserResponseDto from "../../../../../rest/dto/user/UserResponseDto";

interface UserExplorationApiService extends HumanExplorationApiService<UserResponseDto> {
    findByEmail(email: string): Promise<UserResponseDto|null>
}

export default UserExplorationApiService;