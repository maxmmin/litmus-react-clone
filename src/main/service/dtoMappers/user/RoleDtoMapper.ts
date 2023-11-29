import Mapper from "../Mapper";
import Role from "../../../model/userIdentity/Role";
import RoleResponseDto from "../../../rest/dto/RoleResponseDto";

export default interface RoleDtoMapper extends Mapper<RoleResponseDto, Role> {

}