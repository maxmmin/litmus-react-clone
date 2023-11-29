import HierarchyPermissionChecker, {UserAction} from "./HierarchyPermissionChecker";
import Role, {HierarchyProperties} from "../../model/userIdentity/Role";

export default class BasicHierarchyPermissionsChecker implements HierarchyPermissionChecker {
    public static getInstance(): BasicHierarchyPermissionsChecker {
        return new BasicHierarchyPermissionsChecker();
    }
    private isActionRestricted (clientProps: HierarchyProperties, actionType: UserAction) {
        switch (actionType) {
            case UserAction.CREATE:
                return clientProps.creationRestricted;
            case UserAction.READ:
                return clientProps.readRestricted;
            case UserAction.UPDATE:
                return clientProps.updateRestricted;
            case UserAction.DELETE:
                return clientProps.removalRestricted;
        }
    }

    isPermitted(clientProperties: HierarchyProperties, operatedProperties: HierarchyProperties, actionType: UserAction): boolean {
        if (!this.isActionRestricted(clientProperties, actionType)) return true;
        else return clientProperties.hierarchyStage<operatedProperties.hierarchyStage;
    }

    isPermittedByRole(clientRole: Role, operatedRole: Role, action: UserAction): boolean {
        return this.isPermitted(clientRole.hierarchyProperties, operatedRole.hierarchyProperties, action);
    }

}