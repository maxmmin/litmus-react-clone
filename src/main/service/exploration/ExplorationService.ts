import {Entity} from "../../redux/exploration/EntityExplorationState";

interface ExplorationService {
    explore(entity: Entity): void;
}

export default ExplorationService;