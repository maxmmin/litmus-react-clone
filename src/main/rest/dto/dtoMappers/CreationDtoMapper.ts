/**
 * E - entity
 * D - request dto
 */

interface CreationDtoMapper<E, Q, P> {
    mapToRequestDto: (emergingEntity: E) => Q;
    mapToResponseDto: (exploredEntityDto: P) => E;
}

export default CreationDtoMapper;