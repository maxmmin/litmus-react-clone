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

    role: string;

    createdEntities: CreatedEntitiesResponseDto;
}

export default UserResponseDto;