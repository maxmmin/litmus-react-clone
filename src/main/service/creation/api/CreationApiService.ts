/**
 * E - entity
 * D - create request DTO
 */
interface CreationApiService<E, D> {
    create (params: D): Promise<E>;
}

export default CreationApiService;