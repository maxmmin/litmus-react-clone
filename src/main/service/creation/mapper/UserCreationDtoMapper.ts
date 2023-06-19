import CreationDtoMapper from "./CreationDtoMapper";
import User from "../../../model/human/user/User";
import UserCreationApiDto from "./dto/UserCreationApiDto";
import PersonRequestApiDto from "./dto/PersonCreationApiDto";
import {hasContent} from "../../../util/isEmpty";

class UserCreationDtoMapper implements CreationDtoMapper<User, UserCreationApiDto> {
    creationParamsToCreationDto(emergingUser: User): UserCreationApiDto {
        const dto: UserCreationApiDto = {}

        if (hasContent(emergingUser.firstName)) {
            dto.firstName = emergingUser.firstName;
        }

        if (hasContent(emergingUser.middleName)) {
            dto.middleName = emergingUser.middleName;
        }

        if (hasContent(emergingUser.lastName)) {
            dto.lastName = emergingUser.lastName;
        }

        if (hasContent(emergingUser.password)) {
            dto.password = emergingUser.password;
        }

        if (hasContent(emergingUser.email)) {
            dto.email = emergingUser.email;
        }

        if (hasContent(emergingUser.role)) {
            dto.role = emergingUser.role;
        }

        return dto;
    }

}

export default UserCreationDtoMapper;