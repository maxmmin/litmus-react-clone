// import RelationshipsScanService from "./RelationshipsScanService";
// import PersonExplorationApiService from "../exploration/api/human/person/PersonExplorationApiService";
import Person, {RawRelationshipsPerson, Relationship} from "../../model/human/person/Person";
// import PersonExplorationApiServiceImpl, {PersonResponseIdMapDto} from "../exploration/api/human/person/PersonExplorationApiServiceImpl";
// import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
// import deepCopy from "../../util/deepCopy";
// import RelationshipsScanServiceImpl, {NestedPersonsIdMap} from "./RelationshipsScanServiceImpl";
// import PersonDtoMapperImpl from "../../rest/dto/dtoMappers/PersonDtoMapperImpl";
// import PersonRelationshipsAnalyzer, {AnalyzeResult} from "./PersonRelationshipsAnalyzer";
// import {checkNotEmpty} from "../../util/pureFunctions";

// export type PersonStore = Map<number,{person: Person}>
// export type PersonIdMap = Map<number, Person>
// export type OptionalRawPersonIdMap = Map<number, RawRelationsPerson|null>

type RelationshipMapKey = string

export type RelationshipFullInfo = Relationship&{from: Person}

export type PairedRelationshipsFullInfo = [RelationshipFullInfo,RelationshipFullInfo]

export type PairedRelationshipMap = Map<RelationshipMapKey, PairedRelationshipsFullInfo>

export interface AnalyzerOptions {
    currentDepth: number,
    limitDepth: number
}
//
// export function isFinished(options: AnalyzerOptions): boolean {
//     return options.limitDepth!==-1&&options.currentDepth>=options.limitDepth
// }
//
// export default class BasicPersonRelationshipsAnalyzer implements PersonRelationshipsAnalyzer{
//
//     public static getInstance (person: Person,
//                                relationShipsScanService: RelationshipsScanService = RelationshipsScanServiceImpl.getInstance(),
//                                personExplorationApiService: PersonExplorationApiService = PersonExplorationApiServiceImpl.getInstance(),
//                                dtoMapper: PersonDtoMapper = PersonDtoMapperImpl.getInstance()): BasicPersonRelationshipsAnalyzer {
//         return new BasicPersonRelationshipsAnalyzer(person,
//             relationShipsScanService,
//             personExplorationApiService,
//             dtoMapper)
//     }
//
//     protected readonly person: Person;
//
//     constructor(person: Person,
//                 protected readonly relationShipsScanService: RelationshipsScanService,
//                 protected readonly personExplorationApiService: PersonExplorationApiService,
//                 protected readonly dtoMapper: PersonDtoMapper) {
//         this.person = deepCopy(person);
//     }
//
//     private buildPairedMapKey = (personId: number, secondPersonId: number): RelationshipMapKey => {
//         const preProcessedKey: [number, number] = [personId, secondPersonId];
//         return preProcessedKey
//             .sort((a,b)=>a-b)
//             .join("->");
//     }
//
//     private mapRelationsToPairedRelationshipMap (sharedPersons: Set<Person>): PairedRelationshipMap {
//         const pairedMap: PairedRelationshipMap = new Map<RelationshipMapKey, PairedRelationshipsFullInfo>();
//
//         sharedPersons.forEach(person=>{
//             person.relationshipsInfo.relationships.forEach(r=>{
//                 const key = this.buildPairedMapKey(r.to.id, person.id);
//                 if (!pairedMap.has(key)) {
//                     const reversedRelationship = r.to.relationshipsInfo.relationships.find(rel=>rel.to===person);
//                     if (!reversedRelationship) throw new Error("reversed relationship was not found");
//                     pairedMap.set(key, [{...r, from: person}, {...reversedRelationship, from: r.to}]);
//                 }
//             })
//         })
//
//         return pairedMap;
//     }
//
//     public getPerson(): Person {
//         return this.person;
//     }
//
//     //pass -1 to load full
//     async analyze(limit: number = -1): Promise<AnalyzeResult> {
//         const person = this.getPerson();
//         if (limit>person.nestedRelationshipsInfo.scanOptions.depth) {
//             throw new Error("limit is higher that base person scan depth")
//         }
//         return await this.analyzePerson(person, limit);
//     }
//
//     private async analyzePerson (person: Person, limit: number): Promise<AnalyzeResult> {
//         if (this.personStore.has(person.id)) {
//             person = this.personStore.get(person.id)!.person;
//         } else {
//             person = deepCopy(person);
//
//             this.personStore.set(person.id, {person: person});
//         }
//
//         if (!isFinished({limitDepth: limit, currentDepth: 0})) {
//             person.relationshipsInfo.relationships.forEach(r=>{
//                 const relatedPerson = r.to;
//                 this.personStore.set(relatedPerson.id, {person: relatedPerson});
//             })
//         }
//
//         await this.bindRelated(person, limit);
//
//         const relatedPersons = this.relationShipsScanService.getRelatedPersons(person, limit);
//
//         const pairedMap: PairedRelationshipMap = this.mapRelationsToPairedRelationshipMap(relatedPersons);
//
//         return {
//             personsStore: this.personStore,
//             processedPerson: person,
//             unprocessedPerson: this.getPerson(),
//             pairedRelationshipMap: pairedMap,
//             analyzeDepth: limit
//         }
//     }
//
//     private readonly personStore: PersonStore = new Map();
//
//     private async bindRelated (person: Person, limit: number) {
//         const loadedPersons = await this.loadRelated(person, limit);
//
//         [...loadedPersons].forEach(([id,person])=>this.personStore.set(id,{person: person}));
//
//         person.relationshipsInfo.relationships.forEach(r=> {
//             if (r.to.relationshipsInfo.relationships.length === 0) {
//                 r.to.nestedRelationshipsInfo = checkNotEmpty(person.nestedRelationshipsInfo!.relationships.find(nested=>nested.to.id===r.to.id)).to.relationshipsInfo;
//             }
//         });
//
//         [...this.personStore].forEach(([id, personObject])=>{
//             personObject.person.relationshipsInfo.relationships = personObject
//                 .person
//                 .nestedRelationshipsInfo
//                 .relationships
//                 .map((r)=>{
//                     if (this.personStore.has(r.to.id)) {
//                         const relationship: Relationship = {...r, to: this.personStore.get(r.to.id)!.person}
//                         return relationship;
//                     } else return null;
//                 })
//                 .filter((r): r is Relationship=>r!==null)
//             personObject.person.relationshipsInfo.scanOptions = personObject.person.nestedRelationshipsInfo.scanOptions;
//         })
//     }
//
//     private async loadRelated (person: Person, limit: number): Promise<PersonIdMap> {
//         const nestedFiltered = this.getPersonFilteredRelationshipsInfo(person, limit);
//
//         const idList = this.getUnloadedPersonsIdList(nestedFiltered, {currentDepth: 0, limitDepth: limit});
//
//         const personsIdMap: PersonIdMap = new Map();
//
//         if (idList.size>0) {
//             const loadedPersonResponseDtoMap: PersonResponseIdMapDto = await this.personExplorationApiService.findPersons(idList, 1);
//
//             [...this.dtoMapper.mapPersonResponseIdMapDto(loadedPersonResponseDtoMap)].map(([id, person])=>{
//                 if (!person) throw new Error(`person was not found: ${id}`)
//                 personsIdMap.set(id, person);
//             })
//         }
//
//         return personsIdMap;
//     }
//
//     private getUnloadedPersonsIdList(relationshipsInfo: NestedRelationshipsInfo, options: AnalyzerOptions): Set<number> {
//         if (isFinished(options)) return new Set();
//         return relationshipsInfo.relationships.reduce((iterationSet,r)=>{
//             if (!this.personStore.has(r.to.id)) {
//                 iterationSet.add(r.to.id);
//             }
//             return new Set([...iterationSet,...this.getUnloadedPersonsIdList(r.to.relationshipsInfo, {...options, currentDepth: options.currentDepth+1})]);
//         }, new Set<number>())
//     }
//
//     private filterRelationships(relationshipsInfo: NestedRelationshipsInfo, matchList: NestedPersonsIdMap) {
//         relationshipsInfo.relationships = relationshipsInfo.relationships
//             .filter(r=>
//                 matchList.has(r.to.id)
//             );
//
//         relationshipsInfo.relationships.forEach(r=>{
//             this.filterRelationships(r.to.relationshipsInfo, matchList)
//         })
//     }
//
//     /**
//      *
//      * @param person - persons to scan
//      * @param limit - depth of scan
//      * @private method do not mutates original person nestedRelationshipsInfo, just filter it from not shared relationships and returns clone
//      */
//     private getPersonFilteredRelationshipsInfo(person: Person, limit: number): NestedRelationshipsInfo {
//         if (!person.nestedRelationshipsInfo) throw new Error("no nested relationships info present");
//
//         const matchList = this.relationShipsScanService.getSharedPersons(person, limit);
//
//         const nestedRelationshipsInfo: NestedRelationshipsInfo = deepCopy(person.nestedRelationshipsInfo)
//
//         this.filterRelationships(nestedRelationshipsInfo, matchList);
//
//         return nestedRelationshipsInfo;
//     }
// }