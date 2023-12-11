import User, {CreatedEntities} from "../../../model/human/user/User";
import UserRequestDto from "../../../rest/dto/user/UserRequestDto";
import {hasContent} from "../../../util/functional/validation/isEmpty";
import UserResponseDto, {CreatedEntitiesResponseDto} from "../../../rest/dto/user/UserResponseDto";
import {UserCreationParams} from "../../coreServices/creation/UserCreationService";
import UserDtoMapper from "./UserDtoMapper";
import Role from "../../../model/userIdentity/Role";
import UserSimpleResponseDto from "../../../rest/dto/user/UserSimpleResponseDto";
import {blankCreatedEntities, blankMetadata} from "../../../util/modelValueHolders";
import JurPersonDtoMapper from "../jurPerson/JurPersonDtoMapper";
import PersonDtoMapper from "../person/PersonDtoMapper";
import JurPersonDtoMapperImpl from "../jurPerson/JurPersonDtoMapperImpl";
import PersonDtoMapperImpl from "../person/PersonDtoMapperImpl";
import {UserShortResponseDto} from "../../../rest/dto/user/UserShortResponseDto";
import ApplicationResourcesStateManagerImpl from "../../stateManagers/applicationResources/ApplicationResourcesStateManagerImpl";
import ApplicationResourcesStateManager from "../../stateManagers/applicationResources/ApplicationResourcesStateManager";
import getRoleByName from "../../../util/functional/getRoleByName";
import MetadataDtoMapper from "../metadata/MetadataDtoMapper";
import MetadataDtoMapperImpl from "../metadata/MetadataDtoMapperImpl";
import UserShortDtoMapper from "./UserShortDtoMapper";
import UserShortDtoMapperImpl from "./UserShortDtoMapperImpl";

class UserDtoMapperImpl implements UserDtoMapper {
    protected readonly jurPersonDtoMapper: JurPersonDtoMapper;
    protected readonly personDtoMapper: PersonDtoMapper;
    protected readonly appResourcesStateManager: ApplicationResourcesStateManager;
    protected readonly metadataDtoMapper: MetadataDtoMapper;
    protected readonly userShortDtoMapper: UserShortDtoMapper;


    constructor(personDtoMapper: PersonDtoMapper, jurPersonDtoMapper: JurPersonDtoMapper,
                appResourcesStateManager: ApplicationResourcesStateManager,
                metadataDtoMapper: MetadataDtoMapper,
                userShortDtoMapper: UserShortDtoMapper) {
        this.jurPersonDtoMapper = jurPersonDtoMapper;
        this.personDtoMapper = personDtoMapper;
        this.appResourcesStateManager = appResourcesStateManager;
        this.metadataDtoMapper = metadataDtoMapper;
        this.userShortDtoMapper = userShortDtoMapper;
    }

    public static getInstance (personDtoMapper: PersonDtoMapper = PersonDtoMapperImpl.getInstance(),
                jurPersonDtoMapper: JurPersonDtoMapper = JurPersonDtoMapperImpl.getInstance(),
                appResourcesStateManager: ApplicationResourcesStateManager = ApplicationResourcesStateManagerImpl.getInstance(),
                metadataDtoMapper: MetadataDtoMapper = MetadataDtoMapperImpl.getInstance(),
                userShortDtoMapper: UserShortDtoMapper = UserShortDtoMapperImpl.getInstance()
                ): UserDtoMapperImpl {
        return new UserDtoMapperImpl(personDtoMapper, jurPersonDtoMapper, appResourcesStateManager, metadataDtoMapper, userShortDtoMapper);
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
            createdEntities: {...blankCreatedEntities},
            metadata: {...blankMetadata}
        }
    }

    mapShortDtoToEntity(shortDto: UserShortResponseDto): User {
        return this.userShortDtoMapper.map(shortDto);
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

    protected mapCreatedEntities(createdEntitiesDto: CreatedEntitiesResponseDto, createdBy: User|null): CreatedEntities {
        const createdEntities: CreatedEntities = {
            persons: createdEntitiesDto.persons.map(p=>{
                const person = this.personDtoMapper.mapPreProcessedPersonWithLoss(this.personDtoMapper.mapShortDtoToEntity(p.entity));
                person.metadata.createdAt = p.createdAt;
                return person;
            }),
            jurPersons: createdEntitiesDto.jurPersons.map(j => {
                const jurPerson = this.jurPersonDtoMapper.mapPreprocessedJurPersonWithLoss(this.jurPersonDtoMapper.mapShortDtoToEntity(j.entity))
                jurPerson.metadata.createdAt = j.createdAt;
                return jurPerson;
            }),
            users: createdEntitiesDto.users.map(u=>{
                const user = this.mapShortDtoToEntity(u.entity);
                user.metadata.createdAt = u.createdAt;
                return user;
            })
        }

        if (createdBy) {
            Object.values(createdEntities).flat().forEach(entity=>{
                entity.metadata.createdBy = createdBy;
            })
        }

        return createdEntities;
    }

    mapToEntity(exploredEntityDto: UserResponseDto): User {
        const role = getRoleByName(exploredEntityDto.role, this.appResourcesStateManager.getAppResources());
        const user: User = {
            email: exploredEntityDto.email,
            id: exploredEntityDto.id,
            firstName: exploredEntityDto.firstName,
            middleName: exploredEntityDto.middleName,
            lastName: exploredEntityDto.lastName,
            role: role,
            createdEntities: {...blankCreatedEntities},
            metadata: this.metadataDtoMapper.map(exploredEntityDto.metadata)
        }

        user.createdEntities = this.mapCreatedEntities(exploredEntityDto.createdEntities, user);

        return user;
    }

}

export default UserDtoMapperImpl;