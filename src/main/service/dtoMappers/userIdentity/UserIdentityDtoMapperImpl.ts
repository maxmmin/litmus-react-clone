import UserIdentityDtoMapper from "./UserIdentityDtoMapper";
import UserIdentityResponseDto from "../../../rest/dto/UserIdentityResponseDto";
import UserIdentity from "../../../model/userIdentity/UserIdentity";
import {checkNotEmpty} from "../../../util/pureFunctions";
import Role from "../../../model/userIdentity/Role";
import ApplicationGlobalStateManager from "../../stateManagers/applicationGlobalState/ApplicationGlobalStateManager";
import ApplicationResourcesStateManager from "../../stateManagers/applicationResources/ApplicationResourcesStateManager";
import getRoleByName from "../../../util/functional/getRoleByName";
import ApplicationResourcesStateManagerImpl
    from "../../stateManagers/applicationResources/ApplicationResourcesStateManagerImpl";

class UserIdentityDtoMapperImpl implements UserIdentityDtoMapper {
    protected readonly applicationResourcesStateManager: ApplicationResourcesStateManager;


    constructor(applicationResourcesStateManager: ApplicationResourcesStateManager) {
        this.applicationResourcesStateManager = applicationResourcesStateManager;
    }

    public static getInstance(appResourcesStateManager: ApplicationResourcesStateManager = ApplicationResourcesStateManagerImpl.getInstance()): UserIdentityDtoMapperImpl {
        return new UserIdentityDtoMapperImpl(appResourcesStateManager);
    }

    map(dto: UserIdentityResponseDto): UserIdentity {
        return {
            email: dto.email,
            id: dto.id,
            firstName: dto.firstName,
            middleName: dto.middleName,
            lastName: dto.lastName,
            role: getRoleByName(dto.role, this.applicationResourcesStateManager.getAppResources())
        }
    }

}

export default UserIdentityDtoMapperImpl;