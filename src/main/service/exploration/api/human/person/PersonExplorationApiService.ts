import Person, {RelationshipsInfo} from "../../../../../model/human/person/Person";
import HumanExplorationApiService from "../HumanExplorationApiService";
import PersonResponseDto, {
    RelationshipResponseDto,
    RelationshipsInfoResponseDto
} from "../../../../../rest/dto/person/PersonResponseDto";

interface PersonExplorationApiService extends HumanExplorationApiService<PersonResponseDto>{
    findPersonByIdWithDepthOption(id: string, d: number): Promise<PersonResponseDto>;
    findPersonRelationships(id: string, d: number): Promise<RelationshipsInfoResponseDto>
}

export default PersonExplorationApiService;