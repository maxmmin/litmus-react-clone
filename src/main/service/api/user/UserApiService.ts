import ApiService from "../ApiService";
import UserRequestDto from "../../../rest/dto/user/UserRequestDto";
import UserResponseDto from "../../../rest/dto/user/UserResponseDto";
import UserExplorationApiService from "../../exploration/api/human/user/UserExplorationApiService";
import UserCreationApiService from "../../creation/api/UserCreationApiService";
import UserSimpleResponseDto from "../../../rest/dto/user/UserSimpleResponseDto";

export default interface UserApiService extends ApiService<UserRequestDto, UserResponseDto, UserSimpleResponseDto> {

}