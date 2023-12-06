export enum RoleName {
    USER='USER',
    MODERATOR='MODERATOR',
    SUPER_MODERATOR='SUPER_MODERATOR',
    ADMIN='ADMIN',
    ROOT='ROOT'
}

const CanonicalRoleName: Record<RoleName, string> = {
    USER: 'Користувач',
    MODERATOR: 'Модератор',
    SUPER_MODERATOR: 'Супермодератор',
    ADMIN: 'Адміністратор',
    ROOT: 'Рут'
}

enum Permission {
    USERS_READ = "USERS_READ",
    USERS_CREATE="USERS_CREATE",
    USERS_UPDATE="USERS_UPDATE",
    USERS_REMOVE="USERS_REMOVE",
    DATA_READ="DATA_READ",
    DATA_CREATE="DATA_CREATE",
    DATA_UPDATE="DATA_UPDATE",
    DATA_REMOVE="DATA_REMOVE"
}

export interface HierarchyProperties {
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

export class LocalRole {
    private static userPermissions: Permission[] = [Permission.DATA_READ];
    private static moderPermissions: Permission[] = [...this.userPermissions, Permission.DATA_CREATE];
    private static superModerPermissions: Permission[] = [...this.moderPermissions, Permission.DATA_UPDATE, Permission.DATA_REMOVE];
    private static adminPermissions: Permission[] = [...this.superModerPermissions,
        Permission.USERS_CREATE, Permission.USERS_READ, Permission.USERS_UPDATE, Permission.USERS_REMOVE];
    private static rootPermissions: Permission[] = [...this.adminPermissions];

    static [RoleName.ROOT] = new LocalRole(RoleName.ROOT, this.rootPermissions)
    static [RoleName.ADMIN] = new LocalRole(RoleName.ADMIN, this.adminPermissions);
    static [RoleName.SUPER_MODERATOR] = new LocalRole(RoleName.SUPER_MODERATOR, this.superModerPermissions);
    static [RoleName.MODERATOR] = new LocalRole(RoleName.MODERATOR, this.moderPermissions);
    static [RoleName.USER] = new LocalRole(RoleName.USER, this.userPermissions);

    private readonly _name: RoleName;
    private readonly _permissions: Permission[];

    constructor(name: RoleName, permissions: Permission[]) {
        this._name = name;
        this._permissions = permissions;
    }


    get name(): RoleName {
        return this._name;
    }

    get permissions(): Permission[] {
        return this._permissions;
    }
}


export {Permission,CanonicalRoleName};

export default Role;