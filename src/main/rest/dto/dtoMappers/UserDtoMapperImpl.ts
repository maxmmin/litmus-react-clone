import DtoMapper from "./DtoMapper";
import User from "../../../model/human/user/User";
import UserRequestDto from "../user/UserRequestDto";
import {hasContent} from "../../../util/functional/isEmpty";
import UserResponseDto from "../user/UserResponseDto";
import {UserCreationParams} from "../../../service/creation/UserCreationService";
import UserDtoMapper from "./UserDtoMapper";
import {checkNotEmpty} from "../../../util/pureFunctions";
import Role from "../../../redux/types/userIdentity/Role";
import UserSimpleResponseDto from "../user/UserSimpleResponseDto";


class UserDtoMapperImpl implements UserDtoMapper {
    mapSimpleDtoToEntity(simpleDto: UserSimpleResponseDto): User {
        return {
            email: simpleDto.email,
            id: simpleDto.id,
            firstName: simpleDto.firstName,
            middleName: simpleDto.middleName,
            lastName: simpleDto.lastName,
            role: checkNotEmpty(Role[simpleDto.role])
        }
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

    mapToEntity(exploredEntityDto: UserResponseDto): User {
        return {
            email: exploredEntityDto.email,
            id: exploredEntityDto.id,
            firstName: exploredEntityDto.firstName,
            middleName: exploredEntityDto.middleName,
            lastName: exploredEntityDto.lastName,
            role: checkNotEmpty(Role[exploredEntityDto.role])
        }
    }



}

export default UserDtoMapperImpl;