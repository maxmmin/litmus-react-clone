import UserShortDtoMapper from "./UserShortDtoMapper";
import {UserShortResponseDto} from "../../../rest/dto/user/UserShortResponseDto";
import User from "../../../model/human/user/User";
import getRoleByName from "../../../util/functional/getRoleByName";
import ApplicationResourcesStateManager
    from "../../stateManagers/applicationResources/ApplicationResourcesStateManager";
import {blankCreatedEntities, blankMetadata} from "../../../util/modelValueHolders";
import ApplicationResourcesStateManagerImpl
    from "../../stateManagers/applicationResources/ApplicationResourcesStateManagerImpl";

export default class UserShortDtoMapperImpl implements UserShortDtoMapper {
    protected readonly appResourcesStateManager: ApplicationResourcesStateManager;


    constructor(appResourcesStateManager: ApplicationResourcesStateManager) {
        this.appResourcesStateManager = appResourcesStateManager;
    }

    public static getInstance(appResourcesStateManager: ApplicationResourcesStateManager =
                           ApplicationResourcesStateManagerImpl.getInstance()): UserShortDtoMapperImpl {
        return new UserShortDtoMapperImpl(appResourcesStateManager);
    }

    map(shortDto: UserShortResponseDto): User {
        const holder = "_UNKNOWN";
        const role = getRoleByName(shortDto.role, this.appResourcesStateManager.getAppResources());
        return {
            id: shortDto.id,
            role: role,
            email: shortDto.email,
            firstName: holder,
            middleName: holder,
            lastName: holder,
            createdEntities: {...blankCreatedEntities},
            metadata: {...blankMetadata}
        };
    }

}