import {RoleName} from "../../redux/userIdentity/Role";

type User = {
    id?: string;

    email: string;

    firstName: string;

    middleName: string;

    lastName: string;

    password: string

    role: RoleName;

}

export default User;