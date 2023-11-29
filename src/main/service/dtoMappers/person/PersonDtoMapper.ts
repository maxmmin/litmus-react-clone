import DtoMapper from "../DtoMapper";
import PersonRequestDto  from "../../../rest/dto/person/PersonRequestDto";
import Person, {
    PreProcessedPerson,
    Relationship
} from "../../../model/human/person/Person";
import PersonResponseDto, {
    EmbedPersonResponseDto,
    RelationshipResponseDto
} from "../../../rest/dto/person/PersonResponseDto";
import {PersonCreationParams} from "../../coreServices/creation/PersonCreationService";
import {PersonSimpleResponseDto} from "../../../rest/dto/person/PersonSimpleResponseDto";
import {PersonResponseIdMapDto} from "../../api/person/exploration/PersonExplorationApiService";
import {PersonShortResponseDto} from "../../../rest/dto/person/PersonShortResponseDto";

export type OptionalRawPersonIdMap = Map<number, PreProcessedPerson|null>

interface PersonDtoMapper extends DtoMapper<PersonRequestDto, PreProcessedPerson, PersonResponseDto,
    PersonCreationParams, PersonSimpleResponseDto, PersonShortResponseDto> {
    mapPreProcessedPersonWithLoss(preProcessed: Omit<PreProcessedPerson, "ownedJurPersons"|"benOwnedJurPersons"|"relationshipsInfo">): Person;
    mapEmbedPersonResponseDto(dto: EmbedPersonResponseDto): PreProcessedPerson;
    mapPersonResponseIdMapDto(dto: PersonResponseIdMapDto): OptionalRawPersonIdMap;
    mapRelationshipResponseDto (relationshipResponseDto: Omit<RelationshipResponseDto, 'person'>, to: Person): Relationship;
}

export default PersonDtoMapper;