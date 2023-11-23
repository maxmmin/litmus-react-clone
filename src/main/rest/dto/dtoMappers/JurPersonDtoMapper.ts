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
import {JurPersonSimpleResponseDto} from "../jurPerson/JurPersonSimpleResponseDto";

export default interface JurPersonDtoMapper extends DtoMapper<JurPersonRequestDto, PreProcessedJurPerson, JurPersonResponseDto, JurPersonCreationParams,
    JurPersonSimpleResponseDto> {
    mapToRipeJurPerson(dto: Omit<PreProcessedJurPerson|EmbedJurPersonResponseDto, 'owner'|'benOwner'>, owner: Person|null, benOwner: Person|null): JurPerson;
    mapPreprocessedJurPersonWithLoss(dto: PreProcessedJurPerson): JurPerson;
}