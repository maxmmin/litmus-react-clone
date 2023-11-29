import {HierarchyProperties} from "../../model/userIdentity/Role";

export default interface RoleResponseDto {
    name: string;
    permissions: string[];
    hierarchyProperties: HierarchyProperties;
}