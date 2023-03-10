enum Roles {
    ADMIN='ADMIN',
    MODERATOR='MODERATOR',
    USER='USER'
}

enum Permissions {
    USERS_READ = "users:read",
    USERS_WRITE="users:write",
    DATA_READ="data:read",
    DATA_WRITE="data:write"
}

class Role {
    role: Roles;
    permissions: Permissions[];

    constructor(role: Roles, permissions: Permissions[]) {
        this.role = role;
        this.permissions = permissions;
    }
}

type RolesObjectType = Record<Roles, Role>

const adminPermissions = [Permissions.USERS_READ, Permissions.USERS_WRITE, Permissions.DATA_READ, Permissions.DATA_WRITE];
const moderatorPermissions = [Permissions.DATA_READ, Permissions.DATA_WRITE];
const usersPermissions = [Permissions.DATA_READ];


const roles: RolesObjectType = {
    ADMIN: new Role(Roles.ADMIN, adminPermissions),
    MODERATOR: new Role(Roles.MODERATOR, moderatorPermissions),
    USER: new Role(Roles.USER, usersPermissions),
}

export {roles,Permissions,Roles};

export default Role;