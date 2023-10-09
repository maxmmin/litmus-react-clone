import CreationApiService from "./CreationApiService";
import UserRequestDto from "../../../rest/dto/user/UserRequestDto";
import UserResponseDto from "../../../rest/dto/user/UserResponseDto";

export default interface UserCreationApiService extends CreationApiService<UserRequestDto, UserResponseDto> {

}