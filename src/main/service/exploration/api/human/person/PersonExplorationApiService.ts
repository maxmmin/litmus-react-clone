import HumanExplorationApiService from "../HumanExplorationApiService";
import PersonResponseDto, {
    RelationshipsInfo
} from "../../../../../rest/dto/person/PersonResponseDto";
import {PersonResponseIdMapDto, SimplePersonIdMapDto} from "./PersonExplorationApiServiceImpl";
import {PersonSimpleResponseDto} from "../../../../../rest/dto/person/PersonSimpleResponseDto";

interface PersonExplorationApiService extends HumanExplorationApiService<PersonResponseDto, PersonSimpleResponseDto>{
    findByIdWithDepthOption(id: number, d: number): Promise<PersonResponseDto|null>;
    findPersonRelationships(id: number, d: number): Promise<RelationshipsInfo>;
    findPersons(idList: Set<number>, d: number): Promise<PersonResponseIdMapDto>;
    findSimplePersons(idList: Set<number>): Promise<SimplePersonIdMapDto>;
}

export default PersonExplorationApiService;