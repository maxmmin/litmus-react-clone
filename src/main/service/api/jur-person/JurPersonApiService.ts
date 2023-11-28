import EntityApiService from "../EntityApiService";
import JurPersonRequestDto from "../../../rest/dto/jurPerson/JurPersonRequestDto";
import JurPersonResponseDto from "../../../rest/dto/jurPerson/JurPersonResponseDto";
import JurPersonExplorationApiService from "./exploration/JurPersonExplorationApiService";
import JurPersonCreationApiService from "./creation/JurPersonCreationApiService";
import {JurPersonSimpleResponseDto} from "../../../rest/dto/jurPerson/JurPersonSimpleResponseDto";
import {JurPersonShortResponseDto} from "../../../rest/dto/jurPerson/JurPersonShortResponseDto";

export default interface JurPersonApiService extends EntityApiService<JurPersonRequestDto, JurPersonResponseDto, JurPersonSimpleResponseDto, JurPersonShortResponseDto> {

}