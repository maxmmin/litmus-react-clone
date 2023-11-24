/**
 * Q - request dto
 * E - entity
 * P - response dto
 * C - creation params
 * S - simple response dto
 * H - short response dto
 */

interface DtoMapper<Q, E, P, C, S, H> {
    mapToRequestDto: (emergingEntity: C) => Q;
    mapToEntity: (exploredEntityDto: P) => E;
    mapSimpleDtoToEntity: (simpleDto: S) => E;
    mapShortDtoToEntity: (shortDto: H) => E;
}

export default DtoMapper;