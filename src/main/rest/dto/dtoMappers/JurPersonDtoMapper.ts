import DtoMapper from "./DtoMapper";
import JurPersonRequestDto from "../jurPerson/JurPersonRequestDto";
import {
    JurPerson,
    PreProcessedJurPerson
} from "../../../model/jurPerson/JurPerson";
import JurPersonResponseDto, {EmbedJurPersonResponseDto} from "../jurPerson/JurPersonResponseDto";
import {JurPersonCreationParams} from "../../../redux/types/creation/JurPersonCreationState";
import Person from "../../../model/human/person/Person";
import PersonDtoMapper from "./PersonDtoMapper";

export default interface JurPersonDtoMapper extends DtoMapper<JurPersonRequestDto, PreProcessedJurPerson, JurPersonResponseDto, JurPersonCreationParams> {
    mapEmbedResponseDto(dto: EmbedJurPersonResponseDto, owner: Person|null, benOwner: Person|null): JurPerson;
}