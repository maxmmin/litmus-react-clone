import Mapper from "../Mapper";
import {UserShortResponseDto} from "../../../rest/dto/user/UserShortResponseDto";
import User from "../../../model/human/user/User";

export default interface UserShortDtoMapper extends Mapper<UserShortResponseDto, User> {}