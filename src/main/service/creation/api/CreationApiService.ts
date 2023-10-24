/**
 * Q - entityPageComponents request DTO
 * R - entityPageComponents response DTO
 */
interface CreationApiService<Q, R> {
    create (requestDto: Q): Promise<R>;
}

export default CreationApiService;