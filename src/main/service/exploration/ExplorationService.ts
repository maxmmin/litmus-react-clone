import {Entity, EntityExplorationParams} from "../../redux/exploration/EntityExplorationState";


interface ExplorationService {
    exploreById(id: string): void;
}

export default ExplorationService;