import BasicPersonRelationshipsLoader, {NoRelationshipsOptionalPersonMap} from "./BasicPersonRelationshipsLoader";
import Person, {NoRelationsPerson, PreProcessedPerson, Relationship} from "../../model/human/person/Person";
import PersonResponseDto, {
    NestedPersonResponseDto,
    RelatedPersonResponseDto,
} from "../../rest/dto/person/PersonResponseDto";
import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
import PersonProcessor from "./PersonProcessor";
import PersonRelationshipsLoader from "./PersonRelationshipsLoader";
import PreprocessedPersonRelationsScanner from "./PreprocessedPersonRelationsScanner";
import PersonDtoMapperImpl from "../../rest/dto/dtoMappers/PersonDtoMapperImpl";
import RipePersonUtil from "../../util/relationships/RipePersonUtil";
import BasicRipePersonUtil from "../../util/relationships/BasicRipePersonUtil";
import {EmbedJurPersonResponseDto, MinifiedJurPersonResponseDto} from "../../rest/dto/jurPerson/JurPersonResponseDto";
import JurPersonDtoMapper from "../../rest/dto/dtoMappers/JurPersonDtoMapper";
import PreprocessedPersonRelationsScannerImpl from "./PreprocessedPersonRelationsScannerImpl";
import checkJurPersonDto from "../../util/checkJurPersonDto";

export default class BasicPersonProcessor implements PersonProcessor{
    private readonly personsStore = new Map<number, NoRelationsPerson>();
    constructor(protected readonly relationshipsLoader: PersonRelationshipsLoader,
                protected readonly relationshipScanService: PreprocessedPersonRelationsScanner,
                protected readonly dtoMapper: PersonDtoMapper,
                protected readonly jurPersonDtoMapper: JurPersonDtoMapper,
                protected readonly ripePersonRelationshipsUtil: RipePersonUtil) {
    }

    public static getInstance(jurPersonDtoMapper: JurPersonDtoMapper,
                              relationshipsLoader: PersonRelationshipsLoader = BasicPersonRelationshipsLoader.getInstance(),
                              relationshipsDtoScanner: PreprocessedPersonRelationsScanner = PreprocessedPersonRelationsScannerImpl.getInstance(),
                              dtoMapper: PersonDtoMapper = PersonDtoMapperImpl.getInstance(jurPersonDtoMapper),
                              relationshipsUtil: RipePersonUtil = BasicRipePersonUtil.getInstance()): BasicPersonProcessor {
        return new BasicPersonProcessor(relationshipsLoader, relationshipsDtoScanner, dtoMapper, jurPersonDtoMapper, relationshipsUtil);
    }

    clearRawPersonsStorage(): void {
        this.personsStore.clear();
    }

    getRawPersonsStorage(): Map<number, NoRelationsPerson> {
        return new Map(this.personsStore);
    }

    destroy(person: Person): void {
        const allPersons = this.ripePersonRelationshipsUtil.extractRelatedPersons(person);
        allPersons.add(person);
        allPersons.forEach(p=>{
            this._destroySinglePerson(p);
        })
    }

    private _destroySinglePerson(person: Person) {
        person.relationships.forEach(r=>{
            delete (r as Partial<Relationship>)["to"]
        })
        delete (person as Partial<Person>)["relationships"]
    }

    private loadRawPersonToStore(rawPerson: PreProcessedPerson) {
        const clonedPerson: NoRelationsPerson = {...rawPerson};
        // @ts-ignore
        delete clonedPerson['relationshipsInfo'];
        this.personsStore.set(clonedPerson.id, clonedPerson)

        rawPerson.relationshipsInfo.relationships?.forEach(r=>{
            const noRelationsPerson = this.dtoMapper.mapPersonResponseDtoToNoRelationPerson(r.person);
            this.personsStore.set(noRelationsPerson.id, noRelationsPerson);
        })
    }

    private savePersonMap (map: NoRelationshipsOptionalPersonMap) {
        [...map].forEach(([id, person])=>{
            if (!person) throw new Error("person was not found "+id)
            this.personsStore.set(id, person);
        })
    }

    async bindShared (rawPerson: PreProcessedPerson, scanDepth: number): Promise<Person> {
        if (scanDepth>rawPerson.relationshipsInfo.scanOptions.depth) {
            throw new Error("scan depth is higher that person scan depth");
        }

        this.loadRawPersonToStore(rawPerson);
        const {shared, all} = this.relationshipScanService.scan(rawPerson, scanDepth);

        const loadedIdList = [...shared].filter(id=>this.personsStore.has(id));

        loadedIdList.push(rawPerson.id);

        const loadedPersonsMap = await this.relationshipsLoader.loadSharedNestedPersons(rawPerson,scanDepth,new Set(loadedIdList));

        this.savePersonMap(loadedPersonsMap);

        return this.buildRipePerson(rawPerson, shared);
    }

    async bindAll (rawPerson: PreProcessedPerson, scanDepth: number): Promise<Person> {
        if (scanDepth>rawPerson.relationshipsInfo.scanOptions.depth) {
            throw new Error("scan depth is higher that person scan depth");
        }

        this.loadRawPersonToStore(rawPerson);
        const {all} = this.relationshipScanService.scan(rawPerson, scanDepth);

        const loadedIdList = [...all].filter(id=>this.personsStore.has(id));

        loadedIdList.push(rawPerson.id);

        const loadedPersonsMap = await this.relationshipsLoader.loadAllNestedPersons(rawPerson,scanDepth,new Set(loadedIdList));

        this.savePersonMap(loadedPersonsMap);

        return this.buildRipePerson(rawPerson, all);
    }

    private buildRipePerson (rawPerson: PreProcessedPerson, personsToInclude: Set<number>): Person {
        const createdPersons: Map<number,Person> = new Map<number,Person>();

        this.bindRelationships(rawPerson, personsToInclude, createdPersons);

        const jurPersonsContainable: Pick<RelatedPersonResponseDto, 'id'|'ownedJurPersons'|'benOwnedJurPersons'>[] = [rawPerson]
        rawPerson.relationshipsInfo.relationships?.forEach(r=>{
           jurPersonsContainable.push(r.person);
        })
        jurPersonsContainable.forEach(personDto=>{
            personDto.ownedJurPersons.concat(personDto.benOwnedJurPersons).forEach(j=>this.bindJurPerson(j, createdPersons));
        })

        return this.getCreatedPerson(rawPerson.id, createdPersons);
    }


    private bindRelationships(person: NestedPersonResponseDto, personsToInclude: Set<number>, createdPersons: Map<number, Person>): void {
        if (person.relationshipsInfo.relationships) {
            const stack: NestedPersonResponseDto[] = [person]
            const scanned: Set<Person> = new Set()
            while (stack.length>0) {
                const currentPerson = stack.pop()!;
                const personEntity = this.getCreatedPerson(currentPerson.id,createdPersons);
                if (!scanned.has(personEntity)&&currentPerson.relationshipsInfo.relationships) {
                    currentPerson.relationshipsInfo.relationships.forEach(r=>{
                        if (personsToInclude.has(r.person.id)) {
                            const toPerson = this.getCreatedPerson(r.person.id, createdPersons);
                            const relationship = this.dtoMapper.mapRelationshipResponseDto(r, toPerson);
                            personEntity.relationships.push(relationship);
                            stack.push(r.person);
                        }
                    })
                }
                scanned.add(personEntity);
            }
        }
    }

    private bindJurPerson(embedJurPerson: EmbedJurPersonResponseDto|MinifiedJurPersonResponseDto, createdPersons: Map<number,Person>): void {
        const dtoCheck = checkJurPersonDto(embedJurPerson);

        if (!dtoCheck) return;

        const ownerDto = embedJurPerson.owner;

        let owner: Person|null = null;

        if (ownerDto) {
            if (this.personsStore.has(ownerDto.id)) {
                owner = this.getCreatedPerson(ownerDto.id, createdPersons);
            } else {
                owner = {...this.dtoMapper.mapPersonResponseDtoToNoRelationPerson(ownerDto),
                    relationships: [],
                    ownedJurPersons: [],
                    benOwnedJurPersons: []
                };
                this.personsStore.set(owner.id, owner);
            }
        }

        const benOwnerDto = embedJurPerson.benOwner;

        let benOwner: Person|null = null;

        if (benOwnerDto) {
            if (this.personsStore.has(benOwnerDto.id)) {
                benOwner = this.getCreatedPerson(benOwnerDto.id, createdPersons);
            } else {
                benOwner = {...this.dtoMapper.mapPersonResponseDtoToNoRelationPerson(benOwnerDto),
                    relationships: [],
                    ownedJurPersons: [],
                    benOwnedJurPersons: []
                };
                this.personsStore.set(benOwner.id, benOwner);
            }
        }

        if (owner?.ownedJurPersons.some(j=>j.id===embedJurPerson.id)
            ||benOwner?.benOwnedJurPersons.some(j=>j.id===embedJurPerson.id)) {
            return;
        } else {
            const jurPerson = this.jurPersonDtoMapper.mapEmbedResponseDto(embedJurPerson, owner, benOwner);
            if (owner) owner.ownedJurPersons.push(jurPerson);
            if (benOwner) benOwner.benOwnedJurPersons.push(jurPerson);
        }
    }

    private getCreatedPerson(personId: number,createdPersons: Map<number,Person>): Person {
        if (!this.personsStore.has(personId)) throw new Error("person is not loaded: "+personId)
        const person: Person = createdPersons.get(personId)||{...this.personsStore.get(personId)!,
            ownedJurPersons: [],
            benOwnedJurPersons: [],
            relationships: []}
        if (!createdPersons.has(personId)) {
            createdPersons.set(personId, person);
        }
        return person;
    }

}