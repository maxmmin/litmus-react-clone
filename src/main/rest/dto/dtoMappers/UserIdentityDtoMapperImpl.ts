import UserIdentityDtoMapper from "./UserIdentityDtoMapper";
import UserIdentityResponseDto from "../../UserIdentityResponseDto";
import UserIdentity from "../../../redux/types/userIdentity/UserIdentity";
import {checkNotEmpty} from "../../../util/pureFunctions";
import Role from "../../../redux/types/userIdentity/Role";

class UserIdentityDtoMapperImpl implements UserIdentityDtoMapper {
    mapToIdentity(dto: UserIdentityResponseDto): UserIdentity {
        return {
            email: dto.email,
            id: dto.id,
            firstName: dto.firstName,
            middleName: dto.middleName,
            lastName: dto.lastName,
            role: checkNotEmpty(Role[dto.role])
        }
    }

}

export default UserIdentityDtoMapperImpl;