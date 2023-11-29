import ApplicationResources, {RoleMap} from "../../redux/types/applicationResources/ApplicationResources";
import Role from "../../model/userIdentity/Role";

export default function getRoleByName(roleName: string, resources: Pick<ApplicationResources, 'roles'>) {
    const roles: RoleMap|null = resources.roles;
    if (!roles) {
        throw new Error("no roles are loaded: roles map is null");
    } else {
        const role: Role|undefined = roles[roleName];
        if (!role) throw new Error(`no ${roleName} role was found! loaded roles list: ${JSON.stringify(Object.keys(roles))}`);
        return role;
    }
}