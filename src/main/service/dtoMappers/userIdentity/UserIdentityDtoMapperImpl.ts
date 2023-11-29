import UserIdentityDtoMapper from "./UserIdentityDtoMapper";
import UserIdentityResponseDto from "../../../rest/dto/UserIdentityResponseDto";
import UserIdentity from "../../../model/userIdentity/UserIdentity";
import ApplicationResourcesStateManager from "../../stateManagers/applicationResources/ApplicationResourcesStateManager";
import getRoleByName from "../../../util/functional/getRoleByName";
import ApplicationResourcesStateManagerImpl
    from "../../stateManagers/applicationResources/ApplicationResourcesStateManagerImpl";
import MetadataDtoMapper from "../metadata/MetadataDtoMapper";
import MetadataDtoMapperImpl from "../metadata/MetadataDtoMapperImpl";

class UserIdentityDtoMapperImpl implements UserIdentityDtoMapper {
    protected readonly applicationResourcesStateManager: ApplicationResourcesStateManager;

    protected readonly metadataDtoMapper: MetadataDtoMapper;
    constructor(applicationResourcesStateManager: ApplicationResourcesStateManager,
                metadataDtoMapper: MetadataDtoMapper) {
        this.applicationResourcesStateManager = applicationResourcesStateManager;
        this.metadataDtoMapper = metadataDtoMapper;
    }

    public static getInstance(appResourcesStateManager: ApplicationResourcesStateManager = ApplicationResourcesStateManagerImpl.getInstance(),
                              metadataDtoMapper: MetadataDtoMapper = MetadataDtoMapperImpl.getInstance()): UserIdentityDtoMapperImpl {
        return new UserIdentityDtoMapperImpl(appResourcesStateManager, metadataDtoMapper);
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