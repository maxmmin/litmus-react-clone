import ApiService from "../ApiService";
import JurPersonRequestDto from "../../../rest/dto/jurPerson/JurPersonRequestDto";
import JurPersonResponseDto from "../../../rest/dto/jurPerson/JurPersonResponseDto";
import JurPersonExplorationApiService from "../../exploration/api/jurPerson/JurPersonExplorationApiService";
import JurPersonCreationApiService from "../../creation/api/JurPersonCreationApiService";
import {JurPersonSimpleResponseDto} from "../../../rest/dto/jurPerson/JurPersonSimpleResponseDto";
import {JurPersonShortRequestDto} from "../../../rest/dto/jurPerson/JurPersonShortRequestDto";

export default interface JurPersonApiService extends ApiService<JurPersonRequestDto, JurPersonResponseDto, JurPersonSimpleResponseDto, JurPersonShortRequestDto> {

}