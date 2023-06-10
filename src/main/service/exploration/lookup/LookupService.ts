/**
 * E - entity
 * Service which provides work with REST API
 */


interface LookupService<E> {
    findById (id: string): Promise<E|null>;
}

export default LookupService;