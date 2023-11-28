import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import ExplorationApiService from "../../ExplorationApiService";
import PagedData from "../../../../rest/PagedData";
import JurPersonResponseDto from "../../../../rest/dto/jurPerson/JurPersonResponseDto";
import PersonResponseDto from "../../../../rest/dto/person/PersonResponseDto";
import {JurPersonSimpleResponseDto} from "../../../../rest/dto/jurPerson/JurPersonSimpleResponseDto";
import {JurPersonShortResponseDto} from "../../../../rest/dto/jurPerson/JurPersonShortResponseDto";


interface JurPersonExplorationApiService extends ExplorationApiService<JurPersonResponseDto, JurPersonSimpleResponseDto, JurPersonShortResponseDto> {
    findByIdWithDepthOption(id: number, d: number): Promise<JurPersonResponseDto|null>;
    findByName (name: string, i: number): Promise<PagedData<JurPersonSimpleResponseDto>>
}

export default JurPersonExplorationApiService;