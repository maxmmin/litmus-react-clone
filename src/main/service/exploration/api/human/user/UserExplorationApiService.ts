import User from "../../../../../model/human/user/User";
import HumanExplorationApiService from "../HumanExplorationApiService";
import UserResponseDto from "../../../../../rest/dto/user/UserResponseDto";

interface UserExplorationApiService extends HumanExplorationApiService<UserResponseDto> {
}

export default UserExplorationApiService;