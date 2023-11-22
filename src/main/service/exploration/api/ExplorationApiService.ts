/**
 * P - response dto
 * S - simple response dto
 * Service which provides work with REST API
 */
import PagedData from "../../../rest/PagedData";


interface ExplorationApiService<P, S=P> {
    findById (id: number): Promise<P|null>;
    findSimpleById(id: number): Promise<S|null>;
    findAll(index: number): Promise<PagedData<S>>;
}

export default ExplorationApiService;