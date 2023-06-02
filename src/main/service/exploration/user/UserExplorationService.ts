import ExplorationService from "../ExplorationService";
import {FullName} from "../FullName";

interface UserExplorationService extends ExplorationService {
    exploreByFullName (fullName: FullName): void
}

export default UserExplorationService;