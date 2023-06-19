import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import LookupService from "../ExplorationApiService";
import PagedData from "../../../../rest/PagedData";
import JurPersonResponseDto from "../../../../rest/dto/jurPerson/JurPersonResponseDto";


interface JurPersonExplorationApiService extends LookupService<JurPersonResponseDto> {
    findByName (name: string): Promise<PagedData<JurPersonResponseDto>>
}

export default JurPersonExplorationApiService;