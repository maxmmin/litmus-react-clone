import {RoleName} from "../../../redux/types/userIdentity/Role";

export default interface UserRequestDto {
    email?: string;

    firstName?: string;

    middleName?: string;

    lastName?: string;

    password?: string

    role?: RoleName;
}