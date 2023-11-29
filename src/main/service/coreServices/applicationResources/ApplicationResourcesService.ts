import Role from "../../../model/userIdentity/Role";

export default interface ApplicationResourcesService {
    retrieveRoles(): Promise<Role[]>
}