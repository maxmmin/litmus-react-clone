import {Entity} from "../../redux/exploration/EntityExplorationState";

interface ExplorationManager {
    explore(entity: Entity): void;
}

export default ExplorationManager;