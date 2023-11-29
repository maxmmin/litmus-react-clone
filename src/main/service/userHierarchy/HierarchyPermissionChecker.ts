import Role, {HierarchyProperties} from "../../model/userIdentity/Role";

export enum UserAction {
    CREATE="CREATE",
    READ="READ",
    UPDATE="UPDATE",
    DELETE="DELETE"
}

export default interface HierarchyPermissionChecker {
    isPermitted(clientProperties: HierarchyProperties, operatedProperties: HierarchyProperties, action: UserAction): boolean;
    isPermittedByRole(clientRole: Role, operatedRole: Role, action: UserAction): boolean;
}