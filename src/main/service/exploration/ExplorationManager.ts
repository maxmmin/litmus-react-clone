import {Entity} from "../../model/Entity";

interface ExplorationManager {
    explore(entity: Entity): void;
}

export default ExplorationManager;