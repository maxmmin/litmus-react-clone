import Role from "./Role";

class User {
    id: number;

    email?: string;

    firstName: string;

    middleName: string;

    lastName: string;

    role?: string;

    constructor(id: number, lastName: string, middleName: string, firstName: string) {
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.id = id;
    }
}

export default User;