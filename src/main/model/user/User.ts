import {Roles} from "../../redux/userIdentity/Role";

type User = {
    id?: string;

    email: string;

    firstName: string;

    middleName: string;

    lastName: string;

    password: string

    role: Roles;

}

export default User;