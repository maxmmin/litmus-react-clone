import CreationApiService from "./CreationApiService";
import PersonRequestDto from "../../../rest/dto/person/PersonRequestDto";
import PersonResponseDto from "../../../rest/dto/person/PersonResponseDto";

export default interface PersonCreationApiService extends CreationApiService<PersonRequestDto, PersonResponseDto>{

}