import Person, {Relationship, RelationshipsInfo, RelationshipsScanOptions} from "../../model/human/person/Person";
import RelationshipsScanService from "./RelationshipsScanService";
import PersonExplorationApiService from "../exploration/api/human/person/PersonExplorationApiService";
import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
import PersonExplorationApiServiceImpl from "../exploration/api/human/person/PersonExplorationApiServiceImpl";
import PersonDtoMapperImpl from "../../rest/dto/dtoMappers/PersonDtoMapperImpl";
import {RelationshipResponseDto} from "../../rest/dto/person/PersonResponseDto";

export type PersonsIdMap = Map<string, Person>

type PersonScanIdMap = Map<string, {person: Person, clientScanMetaData: ClientRelationshipsScanMetaData}>

export type ClientRelationshipsScanMetaData = {
    depth: number
}

export type RecursiveScanSource = {scanned: PersonScanIdMap, shared: PersonsIdMap};

type RelationshipMapKey = [string, string]

export type PairedRelationships = [Relationship,Relationship]

export type PairedRelationshipsMap = Map<RelationshipMapKey, PairedRelationships>

export default class RelationshipsScanServiceImpl implements RelationshipsScanService {
    constructor(protected readonly apiService: PersonExplorationApiService,
                protected readonly dtoMapper: PersonDtoMapper) {
    }

    public static getInstance (apiService: PersonExplorationApiService = PersonExplorationApiServiceImpl.getInstance(),
                               dtoMapper: PersonDtoMapper = PersonDtoMapperImpl.getInstance()) {
        return new RelationshipsScanServiceImpl(apiService, dtoMapper);
    }

    private buildKey = (personId: string, secondPersonId: string): RelationshipMapKey => {
        const mapKey: RelationshipMapKey = [personId, secondPersonId];
        return mapKey
            .sort((a,b)=>(+a)-(+b));
    }

    async buildPairedRelationshipsMap(sharedPersons: PersonsIdMap): Promise<PairedRelationshipsMap> {
        const optionalPairedRelationshipsMap: Map<RelationshipMapKey, [Relationship, Relationship|null]> = new Map();

        const entries = Array.from(sharedPersons.entries());

        const reverseRelationshipsPromises: {
            key: RelationshipMapKey,
            linkedPersonId: string,
            relationshipsInfoPromise: Promise<RelationshipsInfo>
        }[] = [];

        for (let i = 0; i<entries.length; i++) {
            const [id, person] = entries[i];

            person
                .relationshipsInfo
                .relationships
                .forEach(relationShip => {
                    if (sharedPersons.has(relationShip.to.id)) {
                        const relatedPerson = sharedPersons.get(relationShip.to.id)!;

                        const rKey = this.buildKey(person.id, relatedPerson.id);

                        if (!optionalPairedRelationshipsMap.has(rKey)) {
                            if (relatedPerson.relationshipsInfo.scanOptions?.depth===0) {
                                const promise = this.apiService
                                    .findPersonRelationships(relatedPerson.id, 1)
                                    .then(dto=>this.dtoMapper.mapRelationshipsInfoResponseDto(dto));

                                reverseRelationshipsPromises.push({
                                    key: rKey,
                                    linkedPersonId: id,
                                    relationshipsInfoPromise: promise
                                })
                            }

                            let reverseRelationship: Relationship|null = null;

                            const depth = relatedPerson.relationshipsInfo.scanOptions?.depth;

                            if (depth) {
                                reverseRelationship = relatedPerson
                                    .relationshipsInfo
                                    .relationships
                                    .find(r=>r.to.id===id)!;
                            }


                            const paired: [Relationship, Relationship|null] = [relationShip, reverseRelationship];

                            optionalPairedRelationshipsMap.set(rKey, paired);
                        }
                    }
                })
        }

        if (reverseRelationshipsPromises.length>0) {
            for (let counter = 0; counter<reverseRelationshipsPromises.length; counter++) {
                const {key,relationshipsInfoPromise, linkedPersonId} = reverseRelationshipsPromises[counter];

                if (!optionalPairedRelationshipsMap.get(key)) {
                    throw new Error("key was registered but was not found in relationship map: " + key)
                }

                const relationshipsInfo: RelationshipsInfo = await relationshipsInfoPromise;

                const reverseRelationship = relationshipsInfo
                    .relationships
                    .find(r=>r.to.id===linkedPersonId);

                if (!reverseRelationship) throw new Error("nested relationships where loaded but reverse relationships was not found");

                optionalPairedRelationshipsMap.get(key)![0].to.relationshipsInfo = relationshipsInfo;

                optionalPairedRelationshipsMap.get(key)![1] = reverseRelationship;
            }
        }

        const pairedMap: PairedRelationshipsMap = new Map();

        Array
            .from(optionalPairedRelationshipsMap.entries())
            .forEach(entry => {
                const [key, [relationship, reversedRelationship]] = entry;
                if (!reversedRelationship) throw new Error("reversed relationship was null: " + JSON.stringify(entry));
                pairedMap.set(key, [relationship, reversedRelationship]);
            })

        return pairedMap;
    }

    public recursiveScan(person: Person, counter: number, limit: number): PersonsIdMap {
        const shared: PersonsIdMap = new Map();
        this._recursiveScan(person, {
            scanned: new Map<string, {person: Person; clientScanMetaData: ClientRelationshipsScanMetaData}>(),
            shared: shared
        }, counter, limit);
        return shared;
    }

    private _recursiveScan(person: Person, scanData: RecursiveScanSource, counter: number, limit: number): RecursiveScanSource["scanned"] {
        const shared: PersonsIdMap = scanData.shared;

        return  person
            .relationshipsInfo
            .relationships
            .reduce((accum,relationShip) => {
                    const iterationScanned = new Map(scanData.scanned);

                    if (iterationScanned.has(person.id)) {
                        const prevScanned = iterationScanned.get(person.id)!;
                        if (prevScanned.person.relationshipsInfo.scanOptions?.depth===0) {
                            iterationScanned.set(person.id, {
                                person: person,
                                clientScanMetaData: {
                                    depth: counter
                                }
                            });
                        }
                    } else {
                        iterationScanned.set(person.id, {
                            person: person,
                            clientScanMetaData: {
                                depth: counter
                            }
                        });
                    }

                    if (accum.has(person.id)) {
                        // const prevScanned = accum.get(person.id)!;

                        // if (Math.abs(prevScanned.clientScanMetaData.depth-counter!)!==1) {
                        //     scanData.shared.set(person.id, person);
                        // }
                        scanData.shared.set(person.id, person);
                        // @todo find way to find different branches(idea: dif more that one + person isnt prev
                    }

                    const scanned = this._recursiveScan(relationShip.to, {scanned: iterationScanned, shared: shared}, counter+1, limit);

                    return  new Map([...Array.from(accum.entries()), ...Array.from(scanned.entries())]);
                },
                scanData.scanned
            )
    }
}