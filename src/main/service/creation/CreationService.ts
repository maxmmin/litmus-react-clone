
/**
 * E - entity
 */

interface CreationService<E> {
    createEntity(emergedEntity: E): void;
}

export default CreationService;