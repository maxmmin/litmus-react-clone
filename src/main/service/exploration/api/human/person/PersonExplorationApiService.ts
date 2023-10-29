import HumanExplorationApiService from "../HumanExplorationApiService";
import PersonResponseDto, {
    RelationshipsInfo
} from "../../../../../rest/dto/person/PersonResponseDto";
import {PersonResponseIdMapDto} from "./PersonExplorationApiServiceImpl";

interface PersonExplorationApiService extends HumanExplorationApiService<PersonResponseDto>{
    findPersonByIdWithDepthOption(id: string, d: number): Promise<PersonResponseDto>;
    findPersonRelationships(id: string, d: number): Promise<RelationshipsInfo>;
    findPersons(idList: Set<number>, d: number): Promise<PersonResponseIdMapDto>;
}

export default PersonExplorationApiService;