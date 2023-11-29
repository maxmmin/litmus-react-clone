import RoleResponseDto from "../../../rest/dto/RoleResponseDto";

export default interface ApplicationResourcesApiService {
    fetchRoles: ()=>Promise<RoleResponseDto[]>
}