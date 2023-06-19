import {RoleName} from "../../../redux/types/userIdentity/Role";

type UserResponseDto = {
    id: string;

    email: string;

    firstName: string;

    middleName: string;

    lastName: string;

    password: string

    role: RoleName;
}

export default UserResponseDto;