/**
 * E - entity
 * D - request dto
 */

interface CreationDtoMapper<E, D> {
    creationParamsToCreationDto: (emergingEntity: E) => D;
}

export default CreationDtoMapper;