/**
 * P - response dto
 * Service which provides work with REST API
 */
import PagedData from "../../../rest/PagedData";


interface ExplorationApiService<P> {
    findById (id: number): Promise<P|null>;
    findAll(index: number): Promise<PagedData<P>>;
}

export default ExplorationApiService;