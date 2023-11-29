import DtoMapper from "../DtoMapper";
import UserRequestDto from "../../../rest/dto/user/UserRequestDto";
import User from "../../../model/human/user/User";
import UserResponseDto from "../../../rest/dto/user/UserResponseDto";
import {UserCreationParams} from "../../coreServices/creation/UserCreationService";
import UserSimpleResponseDto from "../../../rest/dto/user/UserSimpleResponseDto";
import {UserShortResponseDto} from "../../../rest/dto/user/UserShortResponseDto";

export default interface UserDtoMapper extends DtoMapper<UserRequestDto, User, UserResponseDto, UserCreationParams, UserSimpleResponseDto,
                                                    UserShortResponseDto> {

}