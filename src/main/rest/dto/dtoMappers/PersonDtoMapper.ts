import DtoMapper from "./DtoMapper";
import PersonRequestDto  from "../person/PersonRequestDto";
import Person, {
    PreProcessedPerson,
    Relationship
} from "../../../model/human/person/Person";
import PersonResponseDto, {
    EmbedPersonResponseDto,
    RelationshipResponseDto
} from "../person/PersonResponseDto";
import {PersonCreationParams} from "../../../service/creation/PersonCreationService";
import {PersonSimpleResponseDto} from "../person/PersonSimpleResponseDto";
import {PersonResponseIdMapDto} from "../../../service/exploration/api/human/person/PersonExplorationApiService";

export type OptionalRawPersonIdMap = Map<number, PreProcessedPerson|null>

interface PersonDtoMapper extends DtoMapper<PersonRequestDto, PreProcessedPerson, PersonResponseDto,
    PersonCreationParams, PersonSimpleResponseDto> {
    mapPreProcessedPersonWithLoss(preProcessed: Omit<PreProcessedPerson, "ownedJurPersons"|"benOwnedJurPersons"|"relationshipsInfo">): Person;
    mapEmbedPersonResponseDto(dto: EmbedPersonResponseDto): PreProcessedPerson;
    mapPersonResponseIdMapDto(dto: PersonResponseIdMapDto): OptionalRawPersonIdMap;
    mapRelationshipResponseDto (relationshipResponseDto: Omit<RelationshipResponseDto, 'person'>, to: Person): Relationship;
}

export default PersonDtoMapper;