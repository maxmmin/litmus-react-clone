import HumanExplorationApiService from "../../human/HumanExplorationApiService";
import UserResponseDto from "../../../../rest/dto/user/UserResponseDto";
import UserSimpleResponseDto from "../../../../rest/dto/user/UserSimpleResponseDto";
import {UserShortResponseDto} from "../../../../rest/dto/user/UserShortResponseDto";

interface UserExplorationApiService extends HumanExplorationApiService<UserResponseDto, UserSimpleResponseDto, UserShortResponseDto> {
    findByEmail(email: string): Promise<UserResponseDto|null>
}

export default UserExplorationApiService;