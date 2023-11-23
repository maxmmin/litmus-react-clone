import {RoleName} from "../../../redux/types/userIdentity/Role";
import UserSimpleResponseDto from "./UserSimpleResponseDto";
import {PersonSimpleResponseDto} from "../person/PersonSimpleResponseDto";
import {JurPersonSimpleResponseDto} from "../jurPerson/JurPersonSimpleResponseDto";

export type CreatedEntitiesResponseDto = {
    users: UserSimpleResponseDto[],
    persons: PersonSimpleResponseDto[],
    jurPersons: JurPersonSimpleResponseDto[]
}
interface UserResponseDto {
    id: number;

    email: string;

    firstName: string;

    middleName: string;

    lastName: string;

    password: string

    role: RoleName;

    createdEntities: CreatedEntitiesResponseDto;
}

export default UserResponseDto;