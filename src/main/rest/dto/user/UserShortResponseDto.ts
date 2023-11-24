import UserResponseDto from "./UserResponseDto";

export type UserShortResponseDto = Pick<UserResponseDto, 'id'|'email'|'role'>