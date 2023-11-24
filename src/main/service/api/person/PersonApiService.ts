import ApiService from "../ApiService";
import PersonRequestDto from "../../../rest/dto/person/PersonRequestDto";
import PersonResponseDto from "../../../rest/dto/person/PersonResponseDto";
import PersonExplorationApiService from "../../exploration/api/human/person/PersonExplorationApiService";
import PersonCreationApiService from "../../creation/api/PersonCreationApiService";
import {PersonSimpleResponseDto} from "../../../rest/dto/person/PersonSimpleResponseDto";
import {PersonShortResponseDto} from "../../../rest/dto/person/PersonShortResponseDto";

export default interface PersonApiService extends ApiService<PersonRequestDto, PersonResponseDto, PersonSimpleResponseDto, PersonShortResponseDto> {}