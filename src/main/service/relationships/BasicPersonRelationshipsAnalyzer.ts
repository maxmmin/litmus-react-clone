import RelationshipsScanService from "./RelationshipsScanService";
import PersonExplorationApiService from "../exploration/api/human/person/PersonExplorationApiService";
import Person, {NestedRelationshipsInfo, Relationship} from "../../model/human/person/Person";
import PersonExplorationApiServiceImpl, {PersonResponseIdMapDto} from "../exploration/api/human/person/PersonExplorationApiServiceImpl";
import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
import deepCopy from "../../util/deepCopy";
import RelationshipsScanServiceImpl, {NestedPersonsIdMap} from "./RelationshipsScanServiceImpl";
import PersonDtoMapperImpl from "../../rest/dto/dtoMappers/PersonDtoMapperImpl";
import PersonRelationshipsAnalyzer, {AnalyzeResult} from "./PersonRelationshipsAnalyzer";
import {checkNotEmpty} from "../../util/pureFunctions";
import {map} from "react-bootstrap/ElementChildren";

export type PersonStore = Map<number,{person: Person}>
export type PersonIdMap = Map<number, Person>
export type OptionalPersonIdMap = Map<number, Person|null>

type RelationshipMapKey = string

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

    protected readonly person: Person;

    constructor(person: Person,
                protected readonly relationShipsScanService: RelationshipsScanService,
                protected readonly personExplorationApiService: PersonExplorationApiService,
                protected readonly dtoMapper: PersonDtoMapper) {
        this.person = deepCopy(person);
    }
    
    private buildPairedMapKey = (personId: number, secondPersonId: number): RelationshipMapKey => {
        const preProcessedKey: [number, number] = [personId, secondPersonId];
        return preProcessedKey
            .sort((a,b)=>a-b)
            .join("->");
    }

    private mapRelationsToPairedRelationshipMap (sharedPersons: Set<Person>): PairedRelationshipMap {
        const pairedMap: PairedRelationshipMap = new Map<RelationshipMapKey, PairedRelationshipsFullInfo>();
        console.log(sharedPersons)
        sharedPersons.forEach(person=>{
            person.relationshipsInfo.relationships.forEach(r=>{
                const key = this.buildPairedMapKey(r.to.id, person.id);
                if (!pairedMap.has(key)) {
                    const reversedRelationship = r.to.relationshipsInfo.relationships.find(rel=>rel.to===person);
                    if (!reversedRelationship) throw new Error("reversed relationship was not found");
                    pairedMap.set(key, [{...r, from: person}, {...reversedRelationship, from: r.to}]);
                }
            })
        })
        
        return pairedMap;
    }

    public getPerson(): Person {
        return this.person;
    }

    async analyze(): Promise<AnalyzeResult> {
        const person = this.getPerson();
        return await this.analyzePerson(person);
    }

    private async analyzePerson (person: Person): Promise<AnalyzeResult> {
        person = deepCopy(person);

        this.personStore.set(person.id, {person: person});

        person.relationshipsInfo.relationships.forEach(r=>{
            const relatedPerson = r.to;
            this.personStore.set(relatedPerson.id, {person: relatedPerson});
        })

        await this.bindRelated(person);

        const relatedPersons = this.relationShipsScanService.getRelatedPersons(person, -1);

        const pairedMap: PairedRelationshipMap = this.mapRelationsToPairedRelationshipMap(relatedPersons);

        return {
            personsStore: this.personStore,
            processedPerson: person,
            originalPerson: this.getPerson(),
            pairedRelationshipMap: pairedMap
        }
    }

    private readonly personStore: PersonStore = new Map();

    private async bindRelated (person: Person) {
        const loadedPersons = await this.loadRelated(person);

        [...loadedPersons].forEach(([id,person])=>this.personStore.set(id,{person: person}));

        person.relationshipsInfo.relationships.forEach(r=> {
            if (r.to.relationshipsInfo.relationships.length === 0) {
                r.to.nestedRelationshipsInfo = person.nestedRelationshipsInfo!.relationships.find(nested=>nested.to.id===r.to.id)!.to.relationshipsInfo;
            }
        });

        [...this.personStore].forEach(([id, personObject])=>{
            personObject.person.relationshipsInfo.relationships = personObject
                .person
                .nestedRelationshipsInfo!
                .relationships
                .map((r)=>{
                    if (this.personStore.has(r.to.id)) {
                        const relationship: Relationship = {...r, to: this.personStore.get(r.to.id)!.person}
                        return relationship;
                    } else return null;
                })
                .filter((r): r is Relationship=>r!==null);
        })
    }

    private async loadRelated (person: Person): Promise<PersonIdMap> {
        const idList = this.getUnloadedPersonsIdList(this.getPersonFilteredRelationshipsInfo(person));
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

    private isPresent(relationshipsInfo: NestedRelationshipsInfo, id: number): boolean {
        return relationshipsInfo.relationships.findIndex(r=>{
            if (r.to.id===id) return true;
            else return this.isPresent(r.to.relationshipsInfo, id)
        })>-1;
    }
}