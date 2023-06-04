import JurPersonExplorationService from "./JurPersonExplorationService";
import {ExplorationMode} from "../../../redux/exploration/EntityExplorationState";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import appConfig from "../../../config/appConfig";

class JurPersonExplorationServiceImpl implements JurPersonExplorationService {
    private readonly apiUrl: string = appConfig.apiMapping.jurPerson;

    findById(id: string): JurPerson {
        fetch()
        return undefined;
    }

    findByName(name: string): JurPerson[] {
        return undefined;
    }

}

export default JurPersonExplorationServiceImpl;