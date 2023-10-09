import DtoMapper from "./DtoMapper";
import PersonRequestDto  from "../person/PersonRequestDto";
import Person, {NestedPerson, Relationship, RelationshipsInfo} from "../../../model/human/person/Person";
import PersonResponseDto, {RelationshipResponseDto, RelationshipsInfoResponseDto} from "../person/PersonResponseDto";
import {PersonResponseIdMapDto} from "../../../service/exploration/api/human/person/PersonExplorationApiServiceImpl";
import {OptionalPersonIdMap, PersonIdMap} from "../../../service/relationships/BasicPersonRelationshipsAnalyzer";
import {PersonCreationParams} from "../../../service/creation/PersonCreationService";

interface PersonDtoMapper extends DtoMapper<PersonRequestDto, Person, PersonResponseDto, PersonCreationParams> {
    mapPersonResponseIdMapDto(dto: PersonResponseIdMapDto): OptionalPersonIdMap;
    mapPersonToNestedPerson(person: Person): NestedPerson;
    mapRelationshipResponseDto (relationshipResponseDto: RelationshipResponseDto): Relationship;
    mapRelationshipsInfoResponseDto(relationshipsInfoResponseDto: RelationshipsInfoResponseDto): RelationshipsInfo;
}

export default PersonDtoMapper;