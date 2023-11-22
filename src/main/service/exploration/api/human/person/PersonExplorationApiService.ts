import HumanExplorationApiService from "../HumanExplorationApiService";
import PersonResponseDto, {
    RelationshipsInfo
} from "../../../../../rest/dto/person/PersonResponseDto";
import {PersonResponseIdMapDto} from "./PersonExplorationApiServiceImpl";
import {PersonSimpleResponseDto} from "../../../../../rest/dto/person/PersonSimpleResponseDto";

interface PersonExplorationApiService extends HumanExplorationApiService<PersonResponseDto>{
    findByIdWithDepthOption(id: number, d: number): Promise<PersonResponseDto|null>;
    findPersonRelationships(id: number, d: number): Promise<RelationshipsInfo>;
    findPersons(idList: Set<number>, d: number): Promise<PersonResponseIdMapDto>;
    findPersonSimpleDto(id: number): Promise<PersonSimpleResponseDto|null>;
}

export default PersonExplorationApiService;