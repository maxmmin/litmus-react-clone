/**
 * E - entity
 * D - request dto
 */

interface CreationDtoMapper<E, Q, P> {
    mapToRequestDto: (emergingEntity: E) => Q;
    mapToEntity: (exploredEntityDto: P) => E;
}

export default CreationDtoMapper;