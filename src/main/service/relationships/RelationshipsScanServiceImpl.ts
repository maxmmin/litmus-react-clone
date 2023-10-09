import Person, {
    NestedPerson,
    Relationship
} from "../../model/human/person/Person";
import RelationshipsScanService from "./RelationshipsScanService";
import PersonExplorationApiService from "../exploration/api/human/person/PersonExplorationApiService";
import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
import PersonExplorationApiServiceImpl from "../exploration/api/human/person/PersonExplorationApiServiceImpl";
import PersonDtoMapperImpl from "../../rest/dto/dtoMappers/PersonDtoMapperImpl";

export type NestedPersonsIdMap = Map<string, NestedPerson>

type PersonScanIdMap = Map<string, {person: NestedPerson, clientScanMetaData: ClientRelationshipsScanMetaData}>

export type ClientRelationshipsScanMetaData = {
    depth: number
}

export type RecursiveScanSource = {scanned: PersonScanIdMap, shared: NestedPersonsIdMap, depth: number, limit: number};



export default class RelationshipsScanServiceImpl implements RelationshipsScanService {
    constructor(protected readonly apiService: PersonExplorationApiService,
                protected readonly dtoMapper: PersonDtoMapper) {
    }

    public static getInstance (apiService: PersonExplorationApiService = PersonExplorationApiServiceImpl.getInstance(),
                               dtoMapper: PersonDtoMapper = PersonDtoMapperImpl.getInstance()) {
        return new RelationshipsScanServiceImpl(apiService, dtoMapper);
    }

    // private buildKey = (personId: string, secondPersonId: string): RelationshipMapKey => {
    //     const mapKey: RelationshipMapKey = [personId, secondPersonId];
    //     return mapKey
    //         .sort((a,b)=>(+a)-(+b));
    // }

    // async buildPairedRelationshipsMap(sharedPersons: PersonsIdMap): Promise<PairedRelationshipsMap> {
    //     const optionalPairedRelationshipsMap: Map<RelationshipMapKey, [RelationshipFullInfo, RelationshipFullInfo|null]> = new Map();
    //
    //     const entries = Array.from(sharedPersons.entries());
    //
    //     const reverseRelationshipsPromises: {
    //         key: RelationshipMapKey,
    //         linkedPersonId: string,
    //         relationshipsInfoPromise: Promise<RelationshipsInfo>
    //     }[] = [];
    //
    //     for (let i = 0; i<entries.length; i++) {
    //         const [id, person] = entries[i];
    //
    //         person
    //             .relationshipsInfo
    //             .relationships
    //             .forEach(relationShip => {
    //                 if (sharedPersons.has(relationShip.to.id)) {
    //                     const relatedPerson = sharedPersons.get(relationShip.to.id)!;
    //
    //                     const rKey = this.buildKey(person.id, relatedPerson.id);
    //
    //                     if (!optionalPairedRelationshipsMap.has(rKey)) {
    //                         if (relatedPerson.relationshipsInfo.scanOptions?.depth===0) {
    //                             const promise = this.apiService
    //                                 .findPersonRelationships(relatedPerson.id, 1)
    //                                 .then(dto=>this.dtoMapper.mapRelationshipsInfoResponseDto(dto));
    //
    //                             reverseRelationshipsPromises.push({
    //                                 key: rKey,
    //                                 linkedPersonId: id,
    //                                 relationshipsInfoPromise: promise
    //                             })
    //                         }
    //
    //                         let reverseRelationshipFullInfo: RelationshipFullInfo|null = null;
    //
    //                         const depth = relatedPerson.relationshipsInfo.scanOptions?.depth;
    //
    //                         if (depth) {
    //                             const reverseRelationship = relatedPerson
    //                                 .relationshipsInfo
    //                                 .relationships
    //                                 .find(r=>r.to.id===id)!;
    //                             reverseRelationshipFullInfo = {...reverseRelationship, from: relatedPerson}
    //                         }
    //
    //
    //                         const paired: [RelationshipFullInfo, RelationshipFullInfo|null] = [
    //                             {...relationShip,from: person},
    //                             reverseRelationshipFullInfo
    //                         ];
    //
    //                         optionalPairedRelationshipsMap.set(rKey, paired);
    //                     }
    //                 }
    //             })
    //     }
    //
    //     if (reverseRelationshipsPromises.length>0) {
    //         for (let counter = 0; counter<reverseRelationshipsPromises.length; counter++) {
    //             const {key,relationshipsInfoPromise} = reverseRelationshipsPromises[counter];
    //
    //             if (!optionalPairedRelationshipsMap.get(key)) {
    //                 throw new Error("key was registered but was not found in relationship map: " + key)
    //             }
    //
    //             const relationshipsInfo: RelationshipsInfo = await relationshipsInfoPromise;
    //
    //             const reverseRelationship = relationshipsInfo
    //                 .relationships
    //                 .find(r=>r.to.id===linkedPersonId);
    //
    //             if (!reverseRelationship) throw new Error("nested relationships where loaded but reverse relationships was not found");
    //
    //             const processedPerson = optionalPairedRelationshipsMap.get(key)![0].to;
    //
    //             processedPerson.relationshipsInfo = relationshipsInfo;
    //
    //             optionalPairedRelationshipsMap.get(key)![1] = {...reverseRelationship, from: processedPerson};
    //         }
    //     }
    //
    //     const pairedMap: PairedRelationshipsMap = new Map();
    //
    //     Array
    //         .from(optionalPairedRelationshipsMap.entries())
    //         .forEach(entry => {
    //             const [key, [relationship, reversedRelationship]] = entry;
    //             if (!reversedRelationship) throw new Error("reversed relationship was null: " + JSON.stringify(entry));
    //             pairedMap.set(key, [relationship, reversedRelationship]);
    //         })
    //
    //     return pairedMap;
    // }

    public getSharedPersons(person: Person, limit: number): NestedPersonsIdMap {
        if (limit===0) return new Map<string, NestedPerson>();

        if (!person.nestedRelationshipsInfo) throw new Error("nested relationships info is undefined")

        const nestedPerson = this.dtoMapper.mapPersonToNestedPerson(person);

        const data: RecursiveScanSource = {
            limit: limit,
            shared: new Map(),
            scanned: new Map(),
            depth: 0
        }

        this.markAsScanned(nestedPerson, data);

        data.depth+=1;

        this._recursiveScan(nestedPerson, data);

        console.log(JSON.stringify(nestedPerson))

        console.log(data.scanned)

        return data.shared;
    }

    private markAsScanned(person: NestedPerson, scanData: RecursiveScanSource) {
        scanData.scanned.set(person.id, {
            person: person,
            clientScanMetaData: {
                depth: scanData.depth
            }
        });
    }

    private markAsShared(person: NestedPerson, sharedStore: RecursiveScanSource["shared"]) {
        sharedStore.set(person.id, person);
    }

    private _recursiveScan(person: NestedPerson, scanData: RecursiveScanSource): void {
        if (scanData.limit!==-1&&!(scanData.depth<scanData.limit)) return;

        const shared = scanData.shared;
        const scanned = scanData.scanned;

        person
            .relationshipsInfo
            .relationships
            .forEach((relationShip) => {
                    const person = relationShip.to;

                    if (scanned.has(person.id)) {
                        const prevScanned = scanned.get(person.id)!;

                        if (shared.has(person.id)) {
                            const saved = shared.get(person.id)!;
                            if (saved.relationshipsInfo.scanOptions.depth===0) {
                                this.markAsShared(person, shared)
                            }
                        } else {
                            if (Math.abs(prevScanned.clientScanMetaData.depth-scanData.depth!)!==1) {
                                this.markAsShared(person, shared)
                            }
                        }
                    }
                    else this.markAsScanned(person, scanData);

                    this._recursiveScan(person, scanData);
                })
    }
}