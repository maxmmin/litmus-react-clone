import EntityApiService from "../EntityApiService";
import PersonRequestDto from "../../../rest/dto/person/PersonRequestDto";
import PersonResponseDto from "../../../rest/dto/person/PersonResponseDto";
import PersonExplorationApiService from "./exploration/PersonExplorationApiService";
import PersonCreationApiService from "./creation/PersonCreationApiService";
import {PersonSimpleResponseDto} from "../../../rest/dto/person/PersonSimpleResponseDto";
import {PersonShortResponseDto} from "../../../rest/dto/person/PersonShortResponseDto";

export default interface PersonApiService extends EntityApiService<PersonRequestDto, PersonResponseDto, PersonSimpleResponseDto, PersonShortResponseDto> {}