import {RoleName} from "../../../redux/types/userIdentity/Role";
import Human from "../Human";

interface User extends Human {
    id: string;

    email: string;

    password: string

    role: RoleName;

}

export default User;