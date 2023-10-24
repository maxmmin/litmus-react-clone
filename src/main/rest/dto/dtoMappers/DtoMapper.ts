/**
 * Q - request dto
 * E - entityPageComponents
 * P - response dto
 * C - creation params
 */

interface DtoMapper<Q, E, P, C=E> {
    mapToRequestDto: (emergingEntity: C) => Q;
    mapToEntity: (exploredEntityDto: P) => E;
}

export default DtoMapper;