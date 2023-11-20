import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import ExplorationApiService from "../ExplorationApiService";
import PagedData from "../../../../rest/PagedData";
import JurPersonResponseDto from "../../../../rest/dto/jurPerson/JurPersonResponseDto";
import PersonResponseDto from "../../../../rest/dto/person/PersonResponseDto";


interface JurPersonExplorationApiService extends ExplorationApiService<JurPersonResponseDto> {
    findByIdWithDepthOption(id: number, d: number): Promise<JurPersonResponseDto|null>;
    findByName (name: string, i: number): Promise<PagedData<JurPersonResponseDto>>
}

export default JurPersonExplorationApiService;