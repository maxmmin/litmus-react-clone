import {RoleMap} from "../../redux/types/applicationResources/ApplicationResources";
import Role from "../../model/userIdentity/Role";

export default function buildRoleMap(roles: Role[]): RoleMap {
    const roleMap: RoleMap = {};
    roles.forEach( role => {
        roleMap[role.name] = role;
    })
    return roleMap;
}