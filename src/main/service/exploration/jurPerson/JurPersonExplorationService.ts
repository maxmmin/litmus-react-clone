import ExplorationService from "../ExplorationService";
import {JurPerson} from "../../../model/jurPerson/JurPerson";

interface JurPersonExplorationService extends ExplorationService<JurPerson> {
    findByName (name: string): JurPerson[]
}

export default JurPersonExplorationService;