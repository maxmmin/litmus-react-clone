import {Entity, EntityExplorationParams} from "../../redux/exploration/EntityExplorationState";


interface ExplorationService<E> {
    findById (id: string): Promise<E>;
}

export default ExplorationService;