import {RoleName} from "../../../redux/types/userIdentity/Role";

interface UserResponseDto {
    id: number;

    email: string;

    firstName: string;

    middleName: string;

    lastName: string;

    password: string

    role: RoleName;
}

export default UserResponseDto;