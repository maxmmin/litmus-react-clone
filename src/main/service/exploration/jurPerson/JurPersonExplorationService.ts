import ExplorationService from "../ExplorationService";

interface JurPersonExplorationService extends ExplorationService {
    exploreByName (name: string): void
}

export default JurPersonExplorationService;