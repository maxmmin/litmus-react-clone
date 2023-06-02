enum RoleName {
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

const adminPermissions = Array.from([Permissions.USERS_READ, Permissions.USERS_WRITE, Permissions.DATA_READ, Permissions.DATA_WRITE]);
const moderatorPermissions = Array.from([Permissions.DATA_READ, Permissions.DATA_WRITE]);
const userPermissions = Array.from([Permissions.DATA_READ]);

class Role {
    static [RoleName.ADMIN] = new Role(RoleName.ADMIN, adminPermissions)
    static [RoleName.MODERATOR] = new Role(RoleName.MODERATOR, moderatorPermissions);
    static [RoleName.USER] = new Role(RoleName.USER, userPermissions);

    readonly role: RoleName;
    readonly permissions: Permissions[];

    private constructor(role: RoleName, permissions: Permissions[]) {
        this.role = role;
        this.permissions = permissions;
    }
}


export {Permissions,RoleName};

export default Role;