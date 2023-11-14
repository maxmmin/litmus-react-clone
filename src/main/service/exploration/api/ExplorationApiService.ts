/**
 * P - response dto
 * Service which provides work with REST API
 */
import PagedData from "../../../rest/PagedData";


interface LookupService<P> {
    findById (id: string): Promise<P|null>;
    findAll(index: number): Promise<PagedData<P>>;
}

export default LookupService;