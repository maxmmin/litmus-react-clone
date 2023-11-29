import Role from "../../../model/userIdentity/Role";

export type RoleMap = Record<string, Role>

export default interface ApplicationResources  {
    roles: RoleMap|null
}