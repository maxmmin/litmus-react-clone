import HumanExplorationApiService from "../HumanExplorationApiService";
import PersonResponseDto, {
    RelationshipsInfo, SimplePersonResponseDto
} from "../../../../../rest/dto/person/PersonResponseDto";
import {PersonResponseIdMapDto} from "./PersonExplorationApiServiceImpl";

interface PersonExplorationApiService extends HumanExplorationApiService<PersonResponseDto>{
    findPersonByIdWithDepthOption(id: number, d: number): Promise<PersonResponseDto|null>;
    findPersonRelationships(id: number, d: number): Promise<RelationshipsInfo>;
    findPersons(idList: Set<number>, d: number): Promise<PersonResponseIdMapDto>;
    findPersonSimpleDto(id: number): Promise<SimplePersonResponseDto|null>;
}

export default PersonExplorationApiService;