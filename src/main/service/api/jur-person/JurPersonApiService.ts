import ApiService from "../ApiService";
import JurPersonRequestDto from "../../../rest/dto/jurPerson/JurPersonRequestDto";
import JurPersonResponseDto from "../../../rest/dto/jurPerson/JurPersonResponseDto";
import JurPersonExplorationApiService from "../../exploration/api/jurPerson/JurPersonExplorationApiService";
import JurPersonCreationApiService from "../../creation/api/JurPersonCreationApiService";

export default interface JurPersonApiService extends JurPersonExplorationApiService, JurPersonCreationApiService, ApiService<JurPersonRequestDto, JurPersonResponseDto> {

}