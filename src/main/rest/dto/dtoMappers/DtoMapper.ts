/**
 * Q - request dto
 * E - entity
 * P - response dto
 */

interface DtoMapper<Q, E, P> {
    mapToRequestDto: (emergingEntity: E) => Q;
    mapToEntity: (exploredEntityDto: P) => E;
}

export default DtoMapper;