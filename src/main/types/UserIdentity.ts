import {Permissions, Roles} from "./Role";

interface User {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    role: Roles;
    permissions: string[];
    status: string;
    records: number;
}

class UserIdentity implements User{
    email: string;
    firstName: string;
    id: number;
    lastName: string;
    middleName: string;
    records: number;
    role: Roles;
    permissions: Permissions[];
    status: string;


    constructor(email: string, firstName: string, id: number, lastName: string, middleName: string, records: number, role: Roles, permissions: Permissions[], status: string) {
        this.email = email;
        this.firstName = firstName;
        this.id = id;
        this.lastName = lastName;
        this.middleName = middleName;
        this.records = records;
        this.role = role;
        this.permissions = permissions;
        this.status = status;
    }
}

export type UserIdentityReducible = UserIdentity | null | undefined

export default UserIdentity;