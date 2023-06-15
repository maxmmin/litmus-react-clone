import {Entity} from "../../model/Entity";

interface ExplorationService {
    explore(entity: Entity): void;
}

export default ExplorationService;