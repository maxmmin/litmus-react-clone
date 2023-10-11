import {
    RelationshipResponseDto,
    RelationshipsInfoResponseDto
} from "../../../rest/dto/person/PersonResponseDto";
import PersonExplorationApiService from "../../../service/exploration/api/human/person/PersonExplorationApiService";
import BasicRelationshipsResponseDtoScanner from "./BasicRelationshipsResponseDtoScanner";
import {PersonResponseIdMapDto} from "../../../service/exploration/api/human/person/PersonExplorationApiServiceImpl";

class BasicPersonRelationshipsLoader {

    constructor(protected readonly relationshipsResponseDtoScanner: BasicRelationshipsResponseDtoScanner,
                protected readonly personApiService: PersonExplorationApiService) {
    }

    loadSharedNestedPersons(dto: RelationshipsInfoResponseDto, limit: number): Promise<PersonResponseIdMapDto> {
        if (!dto.relationships) return Promise.resolve([]);
        const dtoRootRelationships = dto.relationships;
        return this.load(this.relationshipsResponseDtoScanner.scan(dto, limit).shared, dtoRootRelationships);
    }

    loadAllNestedPersons(dto: RelationshipsInfoResponseDto, limit: number): Promise<PersonResponseIdMapDto> {
        if (!dto.relationships) return Promise.resolve([]);
        const dtoRootRelationships = dto.relationships;
        return this.load(this.relationshipsResponseDtoScanner.scan(dto, limit).all, dtoRootRelationships);
    }

    private load (nestedIdSet: Set<number>, dtoRootRelationships: RelationshipResponseDto[]): Promise<PersonResponseIdMapDto> {
        const filteredPersonsIds = [...nestedIdSet]
            .filter(id=>dtoRootRelationships.findIndex(r=>r.person.id===id)!==-1);
        return this.personApiService.findPersons(new Set(filteredPersonsIds), 0);
    }

}