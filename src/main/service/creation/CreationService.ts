
/**
 * E - entity
 */

interface CreationService<E> {
    createEntity(): Promise<E>;
}

export default CreationService;