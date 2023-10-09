import HumanExplorationApiService from "../HumanExplorationApiService";
import PersonResponseDto, {
    RelationshipsInfoResponseDto
} from "../../../../../rest/dto/person/PersonResponseDto";
import {PersonResponseIdMapDto} from "./PersonExplorationApiServiceImpl";

interface PersonExplorationApiService extends HumanExplorationApiService<PersonResponseDto>{
    findPersonByIdWithDepthOption(id: string, d: number): Promise<PersonResponseDto>;
    findPersonRelationships(id: string, d: number): Promise<RelationshipsInfoResponseDto>;
    findPersons(idList: Set<string>, d: number): Promise<PersonResponseIdMapDto>;
}

export default PersonExplorationApiService;