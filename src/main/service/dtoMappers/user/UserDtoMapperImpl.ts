import User, {CreatedEntities} from "../../../model/human/user/User";
import UserRequestDto from "../../../rest/dto/user/UserRequestDto";
import {hasContent} from "../../../util/functional/isEmpty";
import UserResponseDto, {CreatedEntitiesResponseDto} from "../../../rest/dto/user/UserResponseDto";
import {UserCreationParams} from "../../coreServices/creation/UserCreationService";
import UserDtoMapper from "./UserDtoMapper";
import {checkNotEmpty} from "../../../util/pureFunctions";
import Role from "../../../model/userIdentity/Role";
import UserSimpleResponseDto from "../../../rest/dto/user/UserSimpleResponseDto";
import {blankCreatedEntities} from "../../../util/modelValueHolders";
import JurPersonDtoMapper from "../jurPerson/JurPersonDtoMapper";
import PersonDtoMapper from "../person/PersonDtoMapper";
import JurPersonDtoMapperImpl from "../jurPerson/JurPersonDtoMapperImpl";
import PersonDtoMapperImpl from "../person/PersonDtoMapperImpl";
import {UserShortResponseDto} from "../../../rest/dto/user/UserShortResponseDto";
import ApplicationResourcesStateManagerImpl from "../../stateManagers/applicationResources/ApplicationResourcesStateManagerImpl";
import ApplicationResourcesStateManager from "../../stateManagers/applicationResources/ApplicationResourcesStateManager";
import {RoleMap} from "../../../redux/types/applicationResources/ApplicationResources";
import getRoleByName from "../../../util/functional/getRoleByName";

class UserDtoMapperImpl implements UserDtoMapper {
    private readonly jurPersonDtoMapper: JurPersonDtoMapper;
    private readonly personDtoMapper: PersonDtoMapper;
    private readonly appResourcesStateManager: ApplicationResourcesStateManager;


    constructor(personDtoMapper: PersonDtoMapper, jurPersonDtoMapper: JurPersonDtoMapper,
                appResourcesStateManager: ApplicationResourcesStateManager) {
        this.jurPersonDtoMapper = jurPersonDtoMapper;
        this.personDtoMapper = personDtoMapper;
        this.appResourcesStateManager = appResourcesStateManager;
    }

    public static getInstance (personDtoMapper: PersonDtoMapper = PersonDtoMapperImpl.getInstance(),
                jurPersonDtoMapper: JurPersonDtoMapper = JurPersonDtoMapperImpl.getInstance(),
                appResourcesStateManager: ApplicationResourcesStateManager = ApplicationResourcesStateManagerImpl.getInstance()): UserDtoMapperImpl {
        return new UserDtoMapperImpl(personDtoMapper, jurPersonDtoMapper, appResourcesStateManager);
    }
    
    mapSimpleDtoToEntity(simpleDto: UserSimpleResponseDto): User {
        const role: Role = getRoleByName(simpleDto.role, this.appResourcesStateManager.getAppResources());
        return {
            email: simpleDto.email,
            id: simpleDto.id,
            firstName: simpleDto.firstName,
            middleName: simpleDto.middleName,
            lastName: simpleDto.lastName,
            role: role,
            createdEntities: blankCreatedEntities
        }
    }

    mapShortDtoToEntity(shortDto: UserShortResponseDto): User {
        const holder = "_UNKNOWN";
        const role = getRoleByName(shortDto.role, this.appResourcesStateManager.getAppResources());
        return {
            id: shortDto.id,
            role: role,
            email: shortDto.email,
            firstName: holder,
            middleName: holder,
            lastName: holder,
            createdEntities: blankCreatedEntities
        };
    }



    mapToRequestDto(emergingUser: UserCreationParams): UserRequestDto {
        const dto: UserRequestDto = {}

        if (hasContent(emergingUser.firstName)) {
            dto.firstName = emergingUser.firstName!;
        }

        if (hasContent(emergingUser.middleName)) {
            dto.middleName = emergingUser.middleName!;
        }

        if (hasContent(emergingUser.lastName)) {
            dto.lastName = emergingUser.lastName!;
        }

        if (hasContent(emergingUser.password)) {
            dto.password = emergingUser.password;
        }

        if (hasContent(emergingUser.email)) {
            dto.email = emergingUser.email;
        }

        if (emergingUser.role) {
            dto.role = emergingUser.role;
        }

        return dto;
    }

    protected mapCreatedEntities(createdEntities: CreatedEntitiesResponseDto): CreatedEntities {
        return {
            persons: createdEntities.persons.map(p=>{
                return this.personDtoMapper.mapPreProcessedPersonWithLoss(this.personDtoMapper.mapShortDtoToEntity(p))
            }),
            jurPersons: createdEntities.jurPersons.map(j => {
                return this.jurPersonDtoMapper.mapPreprocessedJurPersonWithLoss(this.jurPersonDtoMapper.mapShortDtoToEntity(j))
            }),
            users: createdEntities.users.map(u=>this.mapShortDtoToEntity(u))
        }
    }

    mapToEntity(exploredEntityDto: UserResponseDto): User {
        const role = getRoleByName(exploredEntityDto.role, this.appResourcesStateManager.getAppResources());
        return {
            email: exploredEntityDto.email,
            id: exploredEntityDto.id,
            firstName: exploredEntityDto.firstName,
            middleName: exploredEntityDto.middleName,
            lastName: exploredEntityDto.lastName,
            role: role,
            createdEntities: this.mapCreatedEntities(exploredEntityDto.createdEntities)
        }
    }

}

export default UserDtoMapperImpl;