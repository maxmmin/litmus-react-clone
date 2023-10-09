import RelationshipsScanService from "./RelationshipsScanService";
import PersonExplorationApiService from "../exploration/api/human/person/PersonExplorationApiService";
import Person, {NestedRelationshipsInfo, Relationship} from "../../model/human/person/Person";
import PersonExplorationApiServiceImpl, {PersonResponseIdMapDto} from "../exploration/api/human/person/PersonExplorationApiServiceImpl";
import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
import deepCopy from "../../util/deepCopy";
import RelationshipsScanServiceImpl, {NestedPersonsIdMap} from "./RelationshipsScanServiceImpl";
import PersonDtoMapperImpl from "../../rest/dto/dtoMappers/PersonDtoMapperImpl";
import PersonRelationshipsAnalyzer, {AnalyzeResult} from "./PersonRelationshipsAnalyzer";

export type PersonStore = Map<string,{person: Person}>
export type PersonIdMap = Map<string, Person>
export type OptionalPersonIdMap = Map<string, Person|null>

export default class BasicPersonRelationshipsAnalyzer implements PersonRelationshipsAnalyzer{

    public static getInstance (person: Person,
                               relationShipsScanService: RelationshipsScanService = RelationshipsScanServiceImpl.getInstance(),
                               personExplorationApiService: PersonExplorationApiService = PersonExplorationApiServiceImpl.getInstance(),
                               dtoMapper: PersonDtoMapper = PersonDtoMapperImpl.getInstance()): BasicPersonRelationshipsAnalyzer {
        return new BasicPersonRelationshipsAnalyzer(person,
            relationShipsScanService,
            personExplorationApiService,
            dtoMapper)
    }

    protected filteredRelationshipsInfo: NestedRelationshipsInfo;

    constructor(protected readonly person: Person,
                protected readonly relationShipsScanService: RelationshipsScanService,
                protected readonly personExplorationApiService: PersonExplorationApiService,
                protected readonly dtoMapper: PersonDtoMapper) {
        this.filteredRelationshipsInfo = this.formFilteredRelationshipsInfo(person);
    }

    public getPerson(): Person {
        return this.person;
    }

    getRelatedPersonsStore(): PersonStore {
        return this.personStore;
    };

    async analyze(): Promise<AnalyzeResult> {
        const person = this.getPerson();
        await this.refreshData(person);
        return {
            analyzedPerson: person,
            filteredRelationshipsInfo: this.filteredRelationshipsInfo,
            relatedPersonsStore: this.getRelatedPersonsStore()
        }
    }

    private async refreshData (person: Person) {
        const filtered = this.formFilteredRelationshipsInfo(person);

        this.filteredRelationshipsInfo = filtered;

        const storeEntries = [...this.personStore].filter(([id, person])=>this.isPresent(id, filtered));

        this.personStore.clear();

        storeEntries.forEach(([id, value])=>this.personStore.set(id, value))

        this.personStore.set(person.id, {person});

        person.relationshipsInfo.relationships.forEach(r=>{
            const relatedPerson = r.to;
            this.personStore.set(person.id, {person: relatedPerson});
        })

        await this.bindRelated();
    }

    private readonly personStore: PersonStore = new Map();

    private async bindRelated () {
        const loadedPersons = await this.loadRelated();

        [...loadedPersons].forEach(([id,person])=>this.personStore.set(id,{person: person}));
        [...this.personStore].forEach(([id, personObject])=>{
            personObject.person.nestedRelationshipsInfo = undefined;
            personObject.person.relationshipsInfo.relationships = personObject
                .person
                .relationshipsInfo
                .relationships
                .map(r=>{
                    if (this.personStore.has(r.to.id)) {
                        return {...r, to: this.personStore.get(r.to.id)!};
                    } else return null;
                })
                .filter(r=>r!==null) as unknown as Relationship[];
        })
    }

    private async loadRelated (): Promise<PersonIdMap> {
        const idList = this.getUnloadedPersonsIdList(this.filteredRelationshipsInfo);
        const loadedPersonResponseDtoMap: PersonResponseIdMapDto = await this.personExplorationApiService.findPersons(idList, 1);

        const personsIdMap: PersonIdMap = new Map();

        [...this.dtoMapper.mapPersonResponseIdMapDto(loadedPersonResponseDtoMap)].map(([id, person])=>{
            if (!person) throw new Error(`person was not found: ${id}`)
            personsIdMap.set(id.toString(), person);
        })
        return personsIdMap;
    }

    private getUnloadedPersonsIdList(relationshipsInfo: NestedRelationshipsInfo): Set<string> {
        return relationshipsInfo.relationships.reduce((iterationSet,r)=>{
            if (!this.personStore.has(r.to.id)) {
                iterationSet.add(r.to.id);
            }
            return new Set([...iterationSet,...this.getUnloadedPersonsIdList(r.to.relationshipsInfo)]);
        }, new Set<string>())
    }

    private filterRelationships(relationshipsInfo: NestedRelationshipsInfo, matchList: NestedPersonsIdMap) {
        relationshipsInfo
            .relationships
            .filter(r=>matchList.has(r.to.id))
            .forEach(r=>{
                this.filterRelationships(r.to.relationshipsInfo, matchList)
            })
    }

    public getFilteredRelationshipsInfo(): NestedRelationshipsInfo {
        return this.filteredRelationshipsInfo;
    }

    private formFilteredRelationshipsInfo(person: Person): NestedRelationshipsInfo {
        if (!person.nestedRelationshipsInfo) throw new Error("no nested relationships info present");
        const matchList = this.relationShipsScanService.getSharedPersons(person, -1);

        const nestedRelationshipsInfo: NestedRelationshipsInfo = {
            scanOptions: {depth: -1},
            relationships: deepCopy(person.nestedRelationshipsInfo.relationships)
        }

        this.filterRelationships(nestedRelationshipsInfo, matchList);

        return nestedRelationshipsInfo;
    }

    private isPresent(id: string, relationshipsInfo: NestedRelationshipsInfo): boolean {
        return relationshipsInfo.relationships.findIndex(r=>{
            if (r.to.id===id) return true;
            else return this.isPresent(id, r.to.relationshipsInfo)
        })>-1;
    }
}