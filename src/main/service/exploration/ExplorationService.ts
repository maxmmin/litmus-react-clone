import {Entity} from "../../redux/exploration/Entity";

interface ExplorationService {
    explore(entity: Entity): void;
}

export default ExplorationService;