import ApiService from "../ApiService";
import PersonRequestDto from "../../../rest/dto/person/PersonRequestDto";
import PersonResponseDto from "../../../rest/dto/person/PersonResponseDto";

export default interface PersonApiService extends ApiService<PersonRequestDto, PersonResponseDto> {}