import DtoMapper from "./DtoMapper";
import PersonRequestDto  from "../person/PersonRequestDto";
import Person, {NestedPerson, Relationship, RelationshipsInfo} from "../../../model/human/person/Person";
import PersonResponseDto, {RelationshipResponseDto, RelationshipsInfoResponseDto} from "../person/PersonResponseDto";
import {PersonResponseIdMapDto} from "../../../service/exploration/api/human/person/PersonExplorationApiServiceImpl";
import {OptionalPersonIdMap, PersonIdMap} from "../../../service/relationships/BasicPersonRelationshipsAnalyzer";

interface PersonDtoMapper extends DtoMapper<PersonRequestDto, Person, PersonResponseDto> {
    mapPersonResponseIdMapDto(dto: PersonResponseIdMapDto): OptionalPersonIdMap;
    mapPersonToNestedPerson(person: Person): NestedPerson;
    mapRelationshipResponseDto (relationshipResponseDto: RelationshipResponseDto): Relationship;
    mapRelationshipsInfoResponseDto(relationshipsInfoResponseDto: RelationshipsInfoResponseDto): RelationshipsInfo;
}

export default PersonDtoMapper;