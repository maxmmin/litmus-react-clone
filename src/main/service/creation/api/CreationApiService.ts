/**
 * Q - entity request DTO
 * R - entity response DTO
 */
interface CreationApiService<Q, R> {
    create (requestDto: Q): Promise<R>;
}

export default CreationApiService;