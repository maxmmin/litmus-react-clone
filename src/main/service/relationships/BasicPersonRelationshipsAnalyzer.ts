import RelationshipsScanService from "./RelationshipsScanService";
import PersonExplorationApiService from "../exploration/api/human/person/PersonExplorationApiService";
import Person, {NestedPerson, NestedRelationshipsInfo, Relationship} from "../../model/human/person/Person";
import PersonExplorationApiServiceImpl, {PersonResponseIdMapDto} from "../exploration/api/human/person/PersonExplorationApiServiceImpl";
import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
import deepCopy from "../../util/deepCopy";
import RelationshipsScanServiceImpl, {NestedPersonsIdMap} from "./RelationshipsScanServiceImpl";
import PersonDtoMapperImpl from "../../rest/dto/dtoMappers/PersonDtoMapperImpl";
import PersonRelationshipsAnalyzer, {AnalyzeResult} from "./PersonRelationshipsAnalyzer";

export type PersonStore = Map<number,{person: Person}>
export type PersonIdMap = Map<number, Person>
export type OptionalPersonIdMap = Map<number, Person|null>

type RelationshipMapKey = [string, string]

export type RelationshipFullInfo = Relationship&{from: Person}

export type PairedRelationshipsFullInfo = [RelationshipFullInfo,RelationshipFullInfo]

export type PairedRelationshipMap = Map<RelationshipMapKey, PairedRelationshipsFullInfo>

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

    constructor(protected readonly person: Person,
                protected readonly relationShipsScanService: RelationshipsScanService,
                protected readonly personExplorationApiService: PersonExplorationApiService,
                protected readonly dtoMapper: PersonDtoMapper) {
    }

    private getPairedRelationshipMap (filteredRelationshipsInfo: NestedRelationshipsInfo) {

    }

    private buildPairedMapKey = (personId: string, secondPersonId: string): RelationshipMapKey => {
        const mapKey: RelationshipMapKey = [personId, secondPersonId];
        return mapKey
            .sort((a,b)=>(+a)-(+b));
    }

    // private recursiveBuildPairedRelationshipMap (basePersonId: string, filteredRelationshipsInfo: NestedRelationshipsInfo, pairedMap: PairedRelationshipMap) {
    //     filteredRelationshipsInfo.relationships.forEach(r=>{
    //         const key = this.buildPairedMapKey(r.to.id, basePersonId);
    //         if (!pairedMap.has(key)) {
    //             const reversedRelationship =
    //             const pair: PairedRelationshipsFullInfo = []
    //         }
    //     })
    // }

    public getPerson(): Person {
        return this.person;
    }

    getRelatedPersonsStore(): PersonStore {
        return this.personStore;
    };

    async analyze(): Promise<AnalyzeResult> {
        const person = this.getPerson();
        return await this.analyzePerson(person);
    }

    private async analyzePerson (person: Person): Promise<AnalyzeResult> {
        const filtered = this.getPersonFilteredRelationshipsInfo(person);

        const storeEntries = [...this.personStore].filter(([id, person])=>this.isPresent(id, filtered));

        this.personStore.clear();

        storeEntries.forEach(([id, value])=>this.personStore.set(id, value))

        this.personStore.set(person.id, {person});

        person.relationshipsInfo.relationships.forEach(r=>{
            const relatedPerson = r.to;
            this.personStore.set(person.id, {person: relatedPerson});
        })

        await this.bindRelated();

        return {
            relatedPersonsStore: this.getRelatedPersonsStore(),
            analyzedPerson: this.getPerson(),
            filteredRelationshipsInfo: filtered
        }
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
        const idList = this.getUnloadedPersonsIdList(this.getPersonFilteredRelationshipsInfo(this.person));
        const loadedPersonResponseDtoMap: PersonResponseIdMapDto = await this.personExplorationApiService.findPersons(idList, 1);

        const personsIdMap: PersonIdMap = new Map();

        [...this.dtoMapper.mapPersonResponseIdMapDto(loadedPersonResponseDtoMap)].map(([id, person])=>{
            if (!person) throw new Error(`person was not found: ${id}`)
            personsIdMap.set(id, person);
        })
        return personsIdMap;
    }

    private getUnloadedPersonsIdList(relationshipsInfo: NestedRelationshipsInfo): Set<number> {
        return relationshipsInfo.relationships.reduce((iterationSet,r)=>{
            if (!this.personStore.has(r.to.id)) {
                iterationSet.add(r.to.id);
            }
            return new Set([...iterationSet,...this.getUnloadedPersonsIdList(r.to.relationshipsInfo)]);
        }, new Set<number>())
    }

    private filterRelationships(relationshipsInfo: NestedRelationshipsInfo, matchList: NestedPersonsIdMap) {
        relationshipsInfo
            .relationships
            .filter(r=>matchList.has(r.to.id))
            .forEach(r=>{
                this.filterRelationships(r.to.relationshipsInfo, matchList)
            })
    }


    private getPersonFilteredRelationshipsInfo(person: Person): NestedRelationshipsInfo {
        if (!person.nestedRelationshipsInfo) throw new Error("no nested relationships info present");
        const matchList = this.relationShipsScanService.getSharedPersons(person, -1);

        const nestedRelationshipsInfo: NestedRelationshipsInfo = {
            scanOptions: {depth: -1},
            relationships: deepCopy(person.nestedRelationshipsInfo.relationships)
        }

        this.filterRelationships(nestedRelationshipsInfo, matchList);

        return nestedRelationshipsInfo;
    }

    private isPresent(id: number, relationshipsInfo: NestedRelationshipsInfo): boolean {
        return relationshipsInfo.relationships.findIndex(r=>{
            if (r.to.id===id) return true;
            else return this.isPresent(id, r.to.relationshipsInfo)
        })>-1;
    }
}