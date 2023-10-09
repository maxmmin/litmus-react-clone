import CreationApiService from "./CreationApiService";
import JurPersonRequestDto from "../../../rest/dto/jurPerson/JurPersonRequestDto";
import JurPersonResponseDto from "../../../rest/dto/jurPerson/JurPersonResponseDto";

export default interface JurPersonCreationApiService extends CreationApiService<JurPersonRequestDto, JurPersonResponseDto> {

}