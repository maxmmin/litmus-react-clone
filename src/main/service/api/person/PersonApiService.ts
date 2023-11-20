import ApiService from "../ApiService";
import PersonRequestDto from "../../../rest/dto/person/PersonRequestDto";
import PersonResponseDto from "../../../rest/dto/person/PersonResponseDto";
import PersonExplorationApiService from "../../exploration/api/human/person/PersonExplorationApiService";
import PersonCreationApiService from "../../creation/api/PersonCreationApiService";

export default interface PersonApiService extends PersonExplorationApiService, PersonCreationApiService, ApiService<PersonRequestDto, PersonResponseDto> {}