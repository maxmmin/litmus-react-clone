import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import LookupService from "../ExplorationApiService";


interface JurPersonExplorationApiService extends LookupService<JurPerson> {
    findByName (name: string): Promise<JurPerson[]>
}

export default JurPersonExplorationApiService;