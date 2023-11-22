import HumanExplorationApiService from "../HumanExplorationApiService";
import UserResponseDto from "../../../../../rest/dto/user/UserResponseDto";
import UserSimpleResponseDto from "../../../../../rest/dto/user/UserSimpleResponseDto";

interface UserExplorationApiService extends HumanExplorationApiService<UserResponseDto, UserSimpleResponseDto> {
    findByEmail(email: string): Promise<UserResponseDto|null>
}

export default UserExplorationApiService;