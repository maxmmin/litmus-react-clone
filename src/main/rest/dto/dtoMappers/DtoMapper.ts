/**
 * Q - request dto
 * E - entity
 * P - response dto
 * C - creation params
 */

interface DtoMapper<Q, E, P, C=E, S=P> {
    mapToRequestDto: (emergingEntity: C) => Q;
    mapToEntity: (exploredEntityDto: P) => E;
    mapSimpleDtoToEntity: (simpleDto: S) => E;
}

export default DtoMapper;