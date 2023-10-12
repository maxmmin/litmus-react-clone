import DtoMapper from "./DtoMapper";
import PersonRequestDto  from "../person/PersonRequestDto";
import Person, {
    RawRelationshipsPerson,
    Relationship
} from "../../../model/human/person/Person";
import PersonResponseDto, {RelationshipResponseDto} from "../person/PersonResponseDto";
import {PersonResponseIdMapDto} from "../../../service/exploration/api/human/person/PersonExplorationApiServiceImpl";
import {PersonCreationParams} from "../../../service/creation/PersonCreationService";
import {NoRelationshipsPerson} from "../../../redux/types/creation/PersonCreationState";

export type OptionalRawPersonIdMap = Map<number, RawRelationshipsPerson|null>

interface PersonDtoMapper extends DtoMapper<PersonRequestDto, RawRelationshipsPerson, PersonResponseDto, PersonCreationParams> {
    mapPersonResponseIdMapDto(dto: PersonResponseIdMapDto): OptionalRawPersonIdMap;
    mapPersonResponseDtoToNoRelationPerson(dto: Omit<PersonResponseDto, 'relationshipsInfo'>): NoRelationshipsPerson;
    mapRelationshipResponseDto (relationshipResponseDto: Omit<RelationshipResponseDto, 'person'>, to: Person): Relationship;
}

export default PersonDtoMapper;