import Role, {RoleName} from "../../userIdentity/Role";
import Human from "../Human";
import CoreEntity from "../../CoreEntity";
import Person from "../person/Person";
import {JurPerson} from "../../jurPerson/JurPerson";

export type CreatedEntities = {
    persons: Person[],
    jurPersons: JurPerson[],
    users: User[]
}

interface User extends Human, CoreEntity {
    email: string;
    role: Role;
    createdEntities: CreatedEntities
}

export default User;