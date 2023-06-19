import CreationDtoMapper from "./CreationDtoMapper";
import User from "../../../model/human/user/User";
import UserRequestDto from "../user/UserRequestDto";
import UserResponseDto from "../user/UserResponseDto";
import Person from "../../../model/human/person/Person";
import PersonRequestDto from "../person/PersonRequestDto";
import PersonResponseDto from "../person/PersonResponseDto";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import JurPersonRequestDto from "../jurPerson/JurPersonRequestDto";
import JurPersonResponseDto from "../jurPerson/JurPersonResponseDto";
import JurPersonCreationDtoMapper from "./JurPersonCreationDtoMapper";
import PersonCreationDtoMapper from "./PersonCreationDtoMapper";
import UserCreationDtoMapper from "./UserCreationDtoMapper";

export type DtoMappers = {
    userMapper: CreationDtoMapper<User, UserRequestDto, UserResponseDto>,
    personMapper: CreationDtoMapper<Person, PersonRequestDto, PersonResponseDto>,
    jurPersonMapper: CreationDtoMapper<JurPerson, JurPersonRequestDto, JurPersonResponseDto>
}

export const basicMappers: DtoMappers  = {
    jurPersonMapper: new JurPersonCreationDtoMapper(),
    personMapper: new PersonCreationDtoMapper(),
    userMapper: new UserCreationDtoMapper()
};