import UserResponseDto from "./UserResponseDto";
import {FullName} from "../../../model/human/Human";

type UserSimpleResponseDto = Pick<UserResponseDto, "id"|keyof FullName|"role"|"email">

export default UserSimpleResponseDto;