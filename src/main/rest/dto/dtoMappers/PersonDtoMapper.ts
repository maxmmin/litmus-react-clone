import DtoMapper from "./DtoMapper";
import PersonRequestDto  from "../person/PersonRequestDto";
import Person, {
    NoRelationsPerson,
    PreProcessedPerson,
    Relationship
} from "../../../model/human/person/Person";
import PersonResponseDto, {
    EmbedPersonResponseDto, NestedPersonResponseDto, RelatedPersonResponseDto,
    RelationshipResponseDto,
    SimplePersonResponseDto
} from "../person/PersonResponseDto";
import {PersonResponseIdMapDto} from "../../../service/exploration/api/human/person/PersonExplorationApiServiceImpl";
import {PersonCreationParams} from "../../../service/creation/PersonCreationService";

export type OptionalRawPersonIdMap = Map<number, PreProcessedPerson|null>

interface PersonDtoMapper extends DtoMapper<PersonRequestDto, PreProcessedPerson, PersonResponseDto, PersonCreationParams> {
    mapSimpleResponseDtoToEntity(dto: SimplePersonResponseDto): Person;
    mapEmbedPersonResponseDtoToNoRelationPerson(dto: Omit<EmbedPersonResponseDto, "relationshipsInfo">): NoRelationsPerson;
    mapPersonResponseIdMapDto(dto: PersonResponseIdMapDto): OptionalRawPersonIdMap;
    mapPersonResponseDtoToNoRelationPerson(dto: Omit<PersonResponseDto|RelatedPersonResponseDto, 'relationshipsInfo'>): NoRelationsPerson;
    mapRelationshipResponseDto (relationshipResponseDto: Omit<RelationshipResponseDto, 'person'>, to: Person): Relationship;
}

export default PersonDtoMapper;