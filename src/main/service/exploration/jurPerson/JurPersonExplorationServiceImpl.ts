import JurPersonExplorationService from "./JurPersonExplorationService";
import {ExplorationMode} from "../../../redux/exploration/EntityExplorationState";
import {JurPerson} from "../../../model/jurPerson/JurPerson";

class JurPersonExplorationServiceImpl implements JurPersonExplorationService {
    findById(id: string): JurPerson {
        return undefined;
    }

    findByName(name: string): JurPerson[] {
        return undefined;
    }

}

export default JurPersonExplorationServiceImpl;