/**
 * E - entity
 * P - parameters
 */
interface CreationApiService<E, P> {
    create (params: P): Promise<E>;
}

export default CreationApiService;