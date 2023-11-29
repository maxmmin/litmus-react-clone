import UserIdentityResponseDto from "../../../rest/dto/UserIdentityResponseDto";
import UserIdentity from "../../../model/userIdentity/UserIdentity";
import Mapper from "../Mapper";

export default interface UserIdentityDtoMapper extends Mapper<UserIdentityResponseDto, UserIdentity> {
}