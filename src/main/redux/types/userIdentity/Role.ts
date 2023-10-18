enum RoleName {
    ADMIN='ADMIN',
    MODERATOR='MODERATOR',
    SUPER_MODERATOR='SUPER_MODERATOR',
    USER='USER'
}

enum Permissions {
    USERS_READ = "users:read",
    USERS_WRITE="users:write",
    USERS_UPDATE="users:update",
    USERS_REMOVE="users:remove",
    DATA_READ="data:read",
    DATA_WRITE="data:write",
    DATA_UPDATE="data:update",
    DATA_REMOVE="data:remove"
}

const adminPermissions = Array.from([Permissions.USERS_READ, Permissions.USERS_WRITE, Permissions.USERS_REMOVE, Permissions.USERS_UPDATE,
    Permissions.DATA_READ, Permissions.DATA_WRITE, Permissions.DATA_UPDATE, Permissions.DATA_REMOVE]);
const superModeratorPermissions = Array.from([Permissions.DATA_REMOVE, Permissions.DATA_UPDATE, Permissions.DATA_READ, Permissions.DATA_WRITE])
const moderatorPermissions = Array.from([Permissions.DATA_READ, Permissions.DATA_WRITE]);
const userPermissions = Array.from([Permissions.DATA_READ]);

class Role {
    static [RoleName.ADMIN] = new Role(RoleName.ADMIN, adminPermissions)
    static [RoleName.SUPER_MODERATOR] = new Role(RoleName.SUPER_MODERATOR, superModeratorPermissions);
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