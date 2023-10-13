import {RoleName} from "../../../redux/types/userIdentity/Role";
import Human from "../Human";
import CoreEntity from "../../CoreEntity";

interface User extends Human, CoreEntity {
    email: string;

    password: string

    role: RoleName;
}

export default User;