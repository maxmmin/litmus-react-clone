import UserIdentityResponseDto from "../../UserIdentityResponseDto";
import UserIdentity from "../../../redux/types/userIdentity/UserIdentity";

export default interface UserIdentityDtoMapper {
    mapToIdentity(dto: UserIdentityResponseDto): UserIdentity;
}