import {Entity, EntityExplorationParams} from "../../redux/exploration/EntityExplorationState";


interface ExplorationService<E> {
    findById (id: string): E;
}

export default ExplorationService;