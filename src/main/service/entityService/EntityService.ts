
/**
 * E entityService
 */
interface EntityService<E> {
    findById (id: string): Promise<E>;
}

export default EntityService;