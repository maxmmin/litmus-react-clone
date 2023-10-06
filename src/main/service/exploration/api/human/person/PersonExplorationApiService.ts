import HumanExplorationApiService from "../HumanExplorationApiService";
import PersonResponseDto, {
    RelationshipsInfoResponseDto
} from "../../../../../rest/dto/person/PersonResponseDto";

interface PersonExplorationApiService extends HumanExplorationApiService<PersonResponseDto>{
    findPersonByIdWithDepthOption(id: string, d: number): Promise<PersonResponseDto>;
    findPersonRelationships(id: string, d: number): Promise<RelationshipsInfoResponseDto>;
    findPersons(idArray: Array<string>, d: number): Promise<RelationshipsInfoResponseDto>;
}

export default PersonExplorationApiService;