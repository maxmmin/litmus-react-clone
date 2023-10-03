import DtoMapper from "./DtoMapper";
import PersonRequestDto  from "../person/PersonRequestDto";
import Person, {Relationship, RelationshipsInfo} from "../../../model/human/person/Person";
import PersonResponseDto, {RelationshipResponseDto, RelationshipsInfoResponseDto} from "../person/PersonResponseDto";

interface PersonDtoMapper extends DtoMapper<PersonRequestDto, Person, PersonResponseDto> {
    mapRelationshipResponseDto (relationshipResponseDto: RelationshipResponseDto): Relationship;
    mapRelationshipsInfoResponseDto(relationshipsInfoResponseDto: RelationshipsInfoResponseDto): RelationshipsInfo;
}

export default PersonDtoMapper;