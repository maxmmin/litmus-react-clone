import HumanExplorationApiService from "../HumanExplorationApiService";
import PersonResponseDto, {
    RelationshipsInfo
} from "../../../../../rest/dto/person/PersonResponseDto";
import {PersonSimpleResponseDto} from "../../../../../rest/dto/person/PersonSimpleResponseDto";
import {PersonShortResponseDto} from "../../../../../rest/dto/person/PersonShortResponseDto";

export type PersonResponseIdMapDto = Record<number, PersonResponseDto|null>
export type SimplePersonIdMapDto = Record<number, PersonSimpleResponseDto|null>
export type ShortPersonIdMapDto = Record<number, PersonShortResponseDto|null>

interface PersonExplorationApiService extends HumanExplorationApiService<PersonResponseDto, PersonSimpleResponseDto, PersonShortResponseDto>{
    findByIdWithDepthOption(id: number, d: number): Promise<PersonResponseDto|null>;
    findPersonRelationships(id: number, d: number): Promise<RelationshipsInfo>;
    findPersons(idList: Set<number>, d: number): Promise<PersonResponseIdMapDto>;
    findSimplePersons(idList: Set<number>): Promise<SimplePersonIdMapDto>;
    findShortPersons(idList: Set<number>): Promise<ShortPersonIdMapDto>;
}

export default PersonExplorationApiService;