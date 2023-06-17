/**
 * E - entity
 * P - parameters
 */
interface CreationService<E, P> {
    create (params: P): Promise<E>;
}

export default CreationService;