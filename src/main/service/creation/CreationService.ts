
/**
 * E - entityPageComponents
 */

interface CreationService<E> {
    createEntity(): Promise<E>;
}

export default CreationService;