import UserResponseDto from "./user/UserResponseDto";

export interface MetadataResponseDto {
    createdAt: number;
    createdBy: UserResponseDto|null;
    updatedAt: number;
    updatedBy: UserResponseDto|null;
}

export default interface MetadataContainableResponseDto {
    metadata: MetadataResponseDto
}