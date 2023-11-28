import EntityApiService from "../EntityApiService";
import UserRequestDto from "../../../rest/dto/user/UserRequestDto";
import UserResponseDto from "../../../rest/dto/user/UserResponseDto";
import UserExplorationApiService from "./exploration/UserExplorationApiService";
import UserCreationApiService from "./creation/UserCreationApiService";
import UserSimpleResponseDto from "../../../rest/dto/user/UserSimpleResponseDto";
import {UserShortResponseDto} from "../../../rest/dto/user/UserShortResponseDto";

export default interface UserApiService extends EntityApiService<UserRequestDto, UserResponseDto, UserSimpleResponseDto, UserShortResponseDto> {

}