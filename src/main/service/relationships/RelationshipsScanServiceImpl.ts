// import Person, {
//     NestedPerson,
//     Relationship, RelationshipsInfo
// } from "../../model/human/person/Person";
// import RelationshipsScanService from "./RelationshipsScanService";
// import PersonExplorationApiService from "../exploration/api/human/person/PersonExplorationApiService";
// import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
// import PersonExplorationApiServiceImpl from "../exploration/api/human/person/PersonExplorationApiServiceImpl";
// import PersonDtoMapperImpl from "../../rest/dto/dtoMappers/PersonDtoMapperImpl";
// import {AnalyzerOptions, isFinished} from "./BasicPersonRelationshipsAnalyzer";
//
// export type NestedPersonsIdMap = Map<number, NestedPerson>
//
// type PersonScanIdMap = Map<number, {person: NestedPerson, clientScanMetaData: ClientRelationshipsScanMetaData}>
//
// export type ClientRelationshipsScanMetaData = {
//     depth: number
// }
//
// export interface RecursiveScanSource extends AnalyzerOptions {
//     scanned: PersonScanIdMap, shared: NestedPersonsIdMap
// }
//
//
//
// export default class RelationshipsScanServiceImpl implements RelationshipsScanService {
//     constructor(protected readonly apiService: PersonExplorationApiService,
//                 protected readonly dtoMapper: PersonDtoMapper) {
//     }
//
//     public static getInstance (apiService: PersonExplorationApiService = PersonExplorationApiServiceImpl.getInstance(),
//                                dtoMapper: PersonDtoMapper = PersonDtoMapperImpl.getInstance()) {
//         return new RelationshipsScanServiceImpl(apiService, dtoMapper);
//     }
//
//     public getRelatedPersons(person: Person, limit: number): Set<Person> {
//         const personSet: Set<Person> = new Set<Person>();
//         this._getRelatedPersons(person.relationshipsInfo, personSet, {currentDepth: 0, limitDepth: limit});
//         return personSet;
//     }
//
//     private _getRelatedPersons(relationshipInfo: RelationshipsInfo,personSet: Set<Person>, options: AnalyzerOptions, scannedRelationshipsInfoSet: Set<RelationshipsInfo> = new Set()) {
//         if (isFinished(options)) return;
//         relationshipInfo.relationships.forEach(r=>{
//             if (!personSet.has(r.to)) {
//                 personSet.add(r.to);
//             }
//             if (scannedRelationshipsInfoSet.has(r.to.relationshipsInfo)) return;
//             scannedRelationshipsInfoSet.add(r.to.relationshipsInfo);
//             this._getRelatedPersons(r.to.relationshipsInfo, personSet, {...options, currentDepth: options.currentDepth+1}, scannedRelationshipsInfoSet);
//         })
//     }
//
//     public getSharedPersons(person: Person, limit: number): NestedPersonsIdMap {
//         if (!person.nestedRelationshipsInfo) throw new Error("nested relationships info is undefined")
//
//         const nestedPerson = this.dtoMapper.mapPersonToNestedPerson(person);
//
//         const data: RecursiveScanSource = {
//             limitDepth: limit,
//             shared: new Map(),
//             scanned: new Map(),
//             currentDepth: 0
//         }
//
//         this.markAsScanned(nestedPerson, data);
//
//         data.currentDepth+=1;
//
//         this._recursiveScan(nestedPerson, data);
//
//         return data.shared;
//     }
//
//     private markAsScanned(person: NestedPerson, scanData: RecursiveScanSource) {
//         scanData.scanned.set(person.id, {
//             person: person,
//             clientScanMetaData: {
//                 depth: scanData.currentDepth
//             }
//         });
//     }
//
//     private markAsShared(person: NestedPerson, sharedStore: RecursiveScanSource["shared"]) {
//         sharedStore.set(person.id, person);
//     }
//
//     private _recursiveScan(person: NestedPerson, scanData: RecursiveScanSource): void {
//         if (isFinished(scanData)) return;
//
//         const shared = scanData.shared;
//         const scanned = scanData.scanned;
//
//         person
//             .relationshipsInfo
//             .relationships
//             .forEach((relationShip) => {
//                     const person = relationShip.to;
//
//                     if (scanned.has(person.id)) {
//                         const prevScanned = scanned.get(person.id)!;
//
//                         if (shared.has(person.id)) {
//                             const saved = shared.get(person.id)!;
//                             if (saved.relationshipsInfo.scanOptions.depth===0) {
//                                 this.markAsShared(person, shared)
//                             }
//                         } else {
//                             if (Math.abs(prevScanned.clientScanMetaData.depth-scanData.currentDepth!)!==1) {
//                                 this.markAsShared(person, shared)
//                             }
//                         }
//                     }
//                     else this.markAsScanned(person, scanData);
//
//                     this._recursiveScan(person, scanData);
//                 })
//     }
// }