import ExplorationService from "../ExplorationService";
import {FullName} from "../FullName";

interface PersonExplorationService extends ExplorationService{
    exploreByFullName (fullName: FullName): void
}

export default PersonExplorationService;