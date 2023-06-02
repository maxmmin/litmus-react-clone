import JurPersonExplorationService from "./JurPersonExplorationService";
import {ExplorationMode} from "../../../redux/exploration/EntityExplorationState";
import {JurPerson} from "../../../model/jurPerson/JurPerson";

class JurPersonExplorationServiceImpl implements JurPersonExplorationService {

    findById(id: string): Promise<JurPerson> {
    }

    findByName(name: string): Promise<JurPerson> {
    }

}

export default JurPersonExplorationServiceImpl;