/**
 * P - response dto
 * S - simple response dto
 * H - short response dto
 * Service which provides work with REST API
 */
import PagedData from "../../../rest/PagedData";


interface ExplorationApiService<P, S, H> {
    findById (id: number): Promise<P|null>;
    findSimpleById(id: number): Promise<S|null>;
    findShortById(id: number): Promise<H|null>;
    findAll(index: number): Promise<PagedData<S>>;
}

export default ExplorationApiService;