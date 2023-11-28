enum RoleName {
    USER='USER',
    MODERATOR='MODERATOR',
    SUPER_MODERATOR='SUPER_MODERATOR',
    ADMIN='ADMIN',
}

enum Permission {
    USERS_READ = "users:read",
    USERS_WRITE="users:write",
    USERS_UPDATE="users:update",
    USERS_REMOVE="users:remove",
    DATA_READ="data:read",
    DATA_WRITE="data:write",
    DATA_UPDATE="data:update",
    DATA_REMOVE="data:remove"
}

interface HierarchyProperties {
    hierarchyStage: number;
    creationRestricted: boolean;
    readRestricted: boolean;
    updateRestricted: boolean;
    removalRestricted: boolean;
}

interface Role {
    name: string;
    canonicalName: string;
    permissions: Permission[];
    hierarchyProperties: HierarchyProperties;
}

// class Role {
//     static [RoleName.ADMIN] = new Role(RoleName.ADMIN, adminPermissions, "Адміністратор")
//     static [RoleName.SUPER_MODERATOR] = new Role(RoleName.SUPER_MODERATOR, superModeratorPermissions, "Супермодератор");
//     static [RoleName.MODERATOR] = new Role(RoleName.MODERATOR, moderatorPermissions, "Модератор");
//     static [RoleName.USER] = new Role(RoleName.USER, userPermissions, "Користувач");
//
//     readonly role: RoleName;
//     readonly permissions: Permission[];
//     readonly canonicalName: string;
//
//     private constructor(role: RoleName, permissions: Permission[], canonicalName: string) {
//         this.role = role;
//         this.permissions = permissions;
//         this.canonicalName = canonicalName;
//     }
// }


export {Permission,RoleName};

export default Role;