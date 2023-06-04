/**
 * E - entity
 * Service which provides work with REST API
 */
interface EntityService<E> {
    findById (id: string): Promise<E>;
}

export default EntityService;