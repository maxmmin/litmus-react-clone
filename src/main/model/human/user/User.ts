import Role, {RoleName} from "../../../redux/types/userIdentity/Role";
import Human from "../Human";
import CoreEntity from "../../CoreEntity";

interface User extends Human, CoreEntity {
    email: string;
    role: Role;
}

export default User;