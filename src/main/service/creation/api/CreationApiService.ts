/**
 * Q - entity request DTO
 * R - entity response DTO
 */
interface CreationApiService<Q, R> {
    create (params: Q): Promise<R>;
}

export default CreationApiService;