import UserResponseDto from "./user/UserResponseDto";
import {FullName} from "../../model/human/Human";

type UserIdentityResponseDto = Pick<UserResponseDto, 'id'|keyof FullName|'role'|'email'>;

export default UserIdentityResponseDto;