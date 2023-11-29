import MetadataDtoMapper from "./MetadataDtoMapper";
import {Metadata} from "../../../model/MetadataContainable";
import {MetadataResponseDto} from "../../../rest/dto/MetadataContainableResponseDto";
import User from "../../../model/human/user/User";
import UserShortDtoMapper from "../user/UserShortDtoMapper";
import UserShortDtoMapperImpl from "../user/UserShortDtoMapperImpl";

export default class MetadataDtoMapperImpl implements MetadataDtoMapper {
    protected readonly userDtoMapper: UserShortDtoMapper;

    constructor(dtoMapper: UserShortDtoMapper) {
        this.userDtoMapper = dtoMapper;
    }

    public static getInstance(dtoMapper: UserShortDtoMapper = UserShortDtoMapperImpl.getInstance()): MetadataDtoMapperImpl {
        return new MetadataDtoMapperImpl(dtoMapper);
    }

    map(dto: MetadataResponseDto): Metadata {
        const createdBy: User|null = dto.createdBy ? this.userDtoMapper.map(dto.createdBy):null;
        const updatedBy: User|null = dto.updatedBy ? this.userDtoMapper.map(dto.updatedBy):null;
        return {
            createdBy: createdBy,
            createdAt: dto.createdAt,
            updatedBy: updatedBy,
            updatedAt: dto.updatedAt
        };
    }
}