import DtoMapper from "../DtoMapper";
import JurPersonRequestDto from "../../../rest/dto/jurPerson/JurPersonRequestDto";
import {
    JurPerson,
    PreProcessedJurPerson
} from "../../../model/jurPerson/JurPerson";
import JurPersonResponseDto, {EmbedJurPersonResponseDto} from "../../../rest/dto/jurPerson/JurPersonResponseDto";
import {JurPersonCreationParams} from "../../../redux/types/creation/JurPersonCreationState";
import Person from "../../../model/human/person/Person";
import PersonDtoMapper from "../person/PersonDtoMapper";
import {JurPersonSimpleResponseDto} from "../../../rest/dto/jurPerson/JurPersonSimpleResponseDto";
import {JurPersonShortResponseDto} from "../../../rest/dto/jurPerson/JurPersonShortResponseDto";

export default interface JurPersonDtoMapper extends DtoMapper<JurPersonRequestDto, PreProcessedJurPerson, JurPersonResponseDto, JurPersonCreationParams,
    JurPersonSimpleResponseDto, JurPersonShortResponseDto> {
    mapToRipeJurPerson(dto: Omit<PreProcessedJurPerson|EmbedJurPersonResponseDto, 'owner'|'benOwner'>, owner: Person|null, benOwner: Person|null): JurPerson;
    mapPreprocessedJurPersonWithLoss(dto: PreProcessedJurPerson): JurPerson;
}