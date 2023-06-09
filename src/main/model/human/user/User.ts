import {RoleName} from "../../../redux/userIdentity/Role";

in User = {
    id?: string;

    email: string;

    firstName: string;

    middleName: string;

    lastName: string;

    password: string

    role: RoleName;

}

export default User;