import ApiService from "../ApiService";
import UserRequestDto from "../../../rest/dto/user/UserRequestDto";
import UserResponseDto from "../../../rest/dto/user/UserResponseDto";
import UserExplorationApiService from "../../exploration/api/human/user/UserExplorationApiService";
import UserCreationApiService from "../../creation/api/UserCreationApiService";

export default interface UserApiService extends UserExplorationApiService, UserCreationApiService, ApiService<UserRequestDto, UserResponseDto> {

}