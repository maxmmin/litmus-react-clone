import DtoMapper from "./DtoMapper";
import UserRequestDto from "../user/UserRequestDto";
import User from "../../../model/human/user/User";
import UserResponseDto from "../user/UserResponseDto";
import {UserCreationParams} from "../../../service/coreServices/creation/UserCreationService";
import UserSimpleResponseDto from "../user/UserSimpleResponseDto";
import {UserShortResponseDto} from "../user/UserShortResponseDto";

export default interface UserDtoMapper extends DtoMapper<UserRequestDto, User, UserResponseDto, UserCreationParams, UserSimpleResponseDto,
                                                    UserShortResponseDto> {

}