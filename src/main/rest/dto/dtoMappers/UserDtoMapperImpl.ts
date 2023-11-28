import User, {CreatedEntities} from "../../../model/human/user/User";
import UserRequestDto from "../user/UserRequestDto";
import {hasContent} from "../../../util/functional/isEmpty";
import UserResponseDto, {CreatedEntitiesResponseDto} from "../user/UserResponseDto";
import {UserCreationParams} from "../../../service/coreServices/creation/UserCreationService";
import UserDtoMapper from "./UserDtoMapper";
import {checkNotEmpty} from "../../../util/pureFunctions";
import Role from "../../../redux/types/userIdentity/Role";
import UserSimpleResponseDto from "../user/UserSimpleResponseDto";
import {blankCreatedEntities} from "../../../util/modelValueHolders";
import JurPersonDtoMapper from "./JurPersonDtoMapper";
import PersonDtoMapper from "./PersonDtoMapper";
import JurPersonDtoMapperImpl from "./JurPersonDtoMapperImpl";
import PersonDtoMapperImpl from "./PersonDtoMapperImpl";
import {UserShortResponseDto} from "../user/UserShortResponseDto";

class UserDtoMapperImpl implements UserDtoMapper {
    private readonly jurPersonDtoMapper: JurPersonDtoMapper;
    private readonly personDtoMapper: PersonDtoMapper;


    constructor(personDtoMapper: PersonDtoMapper, jurPersonDtoMapper: JurPersonDtoMapper) {
        this.jurPersonDtoMapper = jurPersonDtoMapper;
        this.personDtoMapper = personDtoMapper;
    }

    public static getInstance (personDtoMapper: PersonDtoMapper = PersonDtoMapperImpl.getInstance(),
                jurPersonDtoMapper: JurPersonDtoMapper = JurPersonDtoMapperImpl.getInstance()): UserDtoMapperImpl {
        return new UserDtoMapperImpl(personDtoMapper, jurPersonDtoMapper);
    }

    mapSimpleDtoToEntity(simpleDto: UserSimpleResponseDto): User {
        return {
            email: simpleDto.email,
            id: simpleDto.id,
            firstName: simpleDto.firstName,
            middleName: simpleDto.middleName,
            lastName: simpleDto.lastName,
            role: checkNotEmpty(Role[simpleDto.role]),
            createdEntities: blankCreatedEntities
        }
    }

    mapShortDtoToEntity(shortDto: UserShortResponseDto): User {
        const holder = "_UNKNOWN";
        return {
            id: shortDto.id,
            role: checkNotEmpty(Role[shortDto.role]),
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
        return {
            email: exploredEntityDto.email,
            id: exploredEntityDto.id,
            firstName: exploredEntityDto.firstName,
            middleName: exploredEntityDto.middleName,
            lastName: exploredEntityDto.lastName,
            role: checkNotEmpty(Role[exploredEntityDto.role]),
            createdEntities: this.mapCreatedEntities(exploredEntityDto.createdEntities)
        }
    }

}

export default UserDtoMapperImpl;