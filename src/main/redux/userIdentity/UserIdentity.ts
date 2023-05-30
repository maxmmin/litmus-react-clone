import {Permissions, Roles} from "./Role";

type UserIdentity = {
    email: string;
    firstName: string;
    id: number;
    lastName: string;
    middleName: string;
    records: number;
    role: Roles;
    permissions: Permissions[];
    status: string;
}

export type UserIdentityReducible = UserIdentity | null | undefined

export default UserIdentity;