import {Permissions, RoleName} from "./Role";
import {UserIdentityState} from "../../reducers/userIdentityReducer";

type UserIdentity = {
    email: string;
    firstName: string;
    id: number;
    lastName: string;
    middleName: string;
    records: number;
    role: RoleName;
    permissions: Permissions[];
    status: string;
}

export type UserIdentityStateReducible = UserIdentityState | undefined

export default UserIdentity;