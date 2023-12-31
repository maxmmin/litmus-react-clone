import PersonExplorationApiService from "../api/person/exploration/PersonExplorationApiService";
import PersonDtoMapper from "../dtoMappers/person/PersonDtoMapper";
import {NoRelationsPerson, PreProcessedPerson} from "../../model/human/person/Person";
import PersonRelationsLoader from "./PersonRelationsLoader";
import PreprocessedPersonRelationsScanner from "./PreprocessedPersonRelationsScanner";
import PersonExplorationApiServiceImpl from "../api/person/exploration/PersonExplorationApiServiceImpl";
import PersonDtoMapperImpl from "../dtoMappers/person/PersonDtoMapperImpl";
import PreprocessedPersonRelationsScannerImpl from "./PreprocessedPersonRelationsScannerImpl";
import {blankRelationshipsInfo} from "../../util/modelValueHolders";

export type NoRelationshipsOptionalPersonMap = Map<number, NoRelationsPerson|null>

export default class BasicPersonRelationshipsLoader implements PersonRelationsLoader{

    public static getInstance(relationshipsResponseDtoScanner: PreprocessedPersonRelationsScanner = PreprocessedPersonRelationsScannerImpl.getInstance(),
                              personApiService: PersonExplorationApiService = PersonExplorationApiServiceImpl.getInstance(),
                              personDtoMapper: PersonDtoMapper = PersonDtoMapperImpl.getInstance()): BasicPersonRelationshipsLoader {
        return new BasicPersonRelationshipsLoader(relationshipsResponseDtoScanner, personApiService, personDtoMapper);
    }

    constructor(protected readonly relationshipsResponseDtoScanner: PreprocessedPersonRelationsScanner,
                protected readonly personApiService: PersonExplorationApiService,
                protected readonly dtoMapper: PersonDtoMapper) {
    }

    loadSharedNestedPersons(person: PreProcessedPerson, limit: number, excludedIdSet: Set<number>): Promise<NoRelationshipsOptionalPersonMap> {
        const dto = person.relationshipsInfo;
        if (!dto.relationships) throw new Error("dto personProcessing are null");
        dto.relationships.forEach(r=>excludedIdSet.add(r.person.id))
        const {shared} = this.relationshipsResponseDtoScanner.scan(person, limit);
        const idList = [...shared].filter(n=>!excludedIdSet.has(n))
        return this.load(new Set(idList));
    }

    loadAllNestedPersons(person: PreProcessedPerson, limit: number, excludedIdSet: Set<number>): Promise<NoRelationshipsOptionalPersonMap> {
        const dto = person.relationshipsInfo;
        if (!dto.relationships) throw new Error("dto personProcessing are null");
        dto.relationships.forEach(r=>excludedIdSet.add(r.person.id))
        const {all} = this.relationshipsResponseDtoScanner.scan(person, limit);
        const idList = [...all].filter(n=>!excludedIdSet.has(n))
        return this.load(new Set(idList));
    }

    public async load (idSet: Set<number>): Promise<NoRelationshipsOptionalPersonMap> {
        const personMap: NoRelationshipsOptionalPersonMap = new Map();

        if (idSet.size>0) {
            const personMapResponseDto = await this.personApiService.findPersons(new Set(idSet), 0);

            for (let key in personMapResponseDto) {
                if (!isNaN(+key)) {
                    const nullablePerson = personMapResponseDto[+key];
                    let mappedPerson: PreProcessedPerson|null = null;
                    if (nullablePerson) {
                        mappedPerson = this.dtoMapper.mapToEntity(nullablePerson);
                        mappedPerson.ownedJurPersons = [];
                        mappedPerson.benOwnedJurPersons = [];
                        mappedPerson.relationshipsInfo = {...blankRelationshipsInfo};
                    }
                    personMap.set(+key, mappedPerson)
                }
            }
        }

        return personMap;
    }

}