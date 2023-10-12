import {
    RelationshipsInfoResponseDto
} from "../../../rest/dto/person/PersonResponseDto";
import PersonExplorationApiService from "../../../service/exploration/api/human/person/PersonExplorationApiService";
import BasicRelationshipsResponseDtoScanner from "./BasicRelationshipsResponseDtoScanner";
import {NoRelationshipsPerson} from "../../../redux/types/creation/PersonCreationState";
import PersonDtoMapper from "../../../rest/dto/dtoMappers/PersonDtoMapper";
import {RawRelationshipsPerson} from "../../../model/human/person/Person";

export type NoRelationshipsOptionalPersonMap = Map<number, NoRelationshipsPerson|null>

export default class BasicPersonRelationshipsLoader {

    constructor(protected readonly relationshipsResponseDtoScanner: BasicRelationshipsResponseDtoScanner,
                protected readonly personApiService: PersonExplorationApiService,
                protected readonly dtoMapper: PersonDtoMapper) {
    }

    loadSharedNestedPersons(person: RawRelationshipsPerson, limit: number, excludedIdSet: Set<number>): Promise<NoRelationshipsOptionalPersonMap> {
        const dto = person.relationshipsInfo;
        if (!dto.relationships) throw new Error("dto relationships are null");
        dto.relationships.forEach(r=>excludedIdSet.add(r.person.id))
        const {shared} = this.relationshipsResponseDtoScanner.scan(person, limit);
        const idList = [...shared].filter(n=>!excludedIdSet.has(n))
        return this.load(new Set(idList));
    }

    loadAllNestedPersons(person: RawRelationshipsPerson, limit: number, excludedIdSet: Set<number>): Promise<NoRelationshipsOptionalPersonMap> {
        const dto = person.relationshipsInfo;
        if (!dto.relationships) throw new Error("dto relationships are null");
        dto.relationships.forEach(r=>excludedIdSet.add(r.person.id))
        const {all} = this.relationshipsResponseDtoScanner.scan(person, limit);
        const idList = [...all].filter(n=>!excludedIdSet.has(n))
        return this.load(new Set(idList));
    }

    private async load (idSet: Set<number>): Promise<NoRelationshipsOptionalPersonMap> {
        const personMapResponseDto = await this.personApiService.findPersons(new Set(idSet), 0);
        const personMap: NoRelationshipsOptionalPersonMap = new Map();
        for (let key in personMapResponseDto) {
            if (!isNaN(+key)) {
                const nullablePerson = personMapResponseDto[+key];
                let mappedPerson: NoRelationshipsPerson|null = null;
                if (nullablePerson) {
                    mappedPerson = this.dtoMapper.mapPersonResponseDtoToNoRelationPerson(nullablePerson);
                }
                personMap.set(+key, mappedPerson)
            }
        }
        return personMap;
    }

}