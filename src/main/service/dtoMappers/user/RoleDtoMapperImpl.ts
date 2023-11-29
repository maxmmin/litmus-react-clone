import RoleDtoMapper from "./RoleDtoMapper";
import Role, {CanonicalRoleName, Permission} from "../../../model/userIdentity/Role";
import RoleResponseDto from "../../../rest/dto/RoleResponseDto";

export default class RoleDtoMapperImpl implements RoleDtoMapper {
    public static getInstance(): RoleDtoMapperImpl {
        return new RoleDtoMapperImpl();
    }
    private permissionExists(p: string): p is Permission {
        return Object.values(Permission).includes(p as Permission);
    };

    private permissionExistsWithLog(p: string): p is Permission {
        const exists = this.permissionExists(p);
        if (!exists) console.warn(`permission ${p} is not registered locally`);
        return exists;
    };

    protected getCanonicalName(name: string): string|undefined {
        const rolePair =  Object.entries(CanonicalRoleName)
            .find(([role,canonicalName])=>name===role);
        return rolePair&&rolePair[1];
    }

    map(roleDto: RoleResponseDto): Role {
        const permissions: Permission[] = roleDto.permissions.filter(this.permissionExistsWithLog.bind(this))
        const canonicalName: string|undefined = this.getCanonicalName(roleDto.name);
        if (!canonicalName) console.warn(`No canonical name set up for role ${roleDto.name}. Using default name.`)
        return {
            name: roleDto.name,
            canonicalName: canonicalName||roleDto.name,
            permissions: permissions,
            hierarchyProperties: roleDto.hierarchyProperties
        }
    }

}