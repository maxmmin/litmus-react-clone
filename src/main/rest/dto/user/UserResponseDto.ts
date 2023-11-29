import UserSimpleResponseDto from "./UserSimpleResponseDto";
import {PersonSimpleResponseDto} from "../person/PersonSimpleResponseDto";
import {JurPersonSimpleResponseDto} from "../jurPerson/JurPersonSimpleResponseDto";
import MetadataContainableResponseDto from "../MetadataContainableResponseDto";

type EntityCreatedByResponseDto<E> = {
    entity: E,
    createdAt: number
}

export type CreatedEntitiesResponseDto = {
    users: EntityCreatedByResponseDto<UserSimpleResponseDto>[],
    persons: EntityCreatedByResponseDto<PersonSimpleResponseDto>[],
    jurPersons: EntityCreatedByResponseDto<JurPersonSimpleResponseDto>[]
}

interface UserResponseDto extends MetadataContainableResponseDto {
    id: number;

    email: string;

    firstName: string;

    middleName: string;

    lastName: string;

    role: string;

    createdEntities: CreatedEntitiesResponseDto;
}

export default UserResponseDto;