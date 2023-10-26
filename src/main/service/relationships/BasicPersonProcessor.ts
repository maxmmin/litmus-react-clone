import BasicPersonRelationshipsLoader, {NoRelationshipsOptionalPersonMap} from "./BasicPersonRelationshipsLoader";
import Person, {PreProcessedPerson, Relationship} from "../../model/human/person/Person";
import BasicPersonRelationshipsResponseDtoScanner from "./BasicPersonRelationshipsResponseDtoScanner";
import {NoRelationshipsPerson} from "../../redux/types/creation/PersonCreationState";
import {
    NestedRelationshipResponseDto
} from "../../rest/dto/person/PersonResponseDto";
import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
import PersonProcessor from "./PersonProcessor";
import PersonRelationshipsLoader from "./PersonRelationshipsLoader";
import PersonRelationshipsResponseDtoScanner from "./PersonRelationshipsResponseDtoScanner";
import PersonDtoMapperImpl from "../../rest/dto/dtoMappers/PersonDtoMapperImpl";
import RipePersonRelationshipsUtil from "./RipePersonRelationshipsUtil";
import BasicRipePersonRelationshipsUtil from "./BasicRipePersonRelationshipsUtil";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import {checkNotEmpty} from "../../util/pureFunctions";

export default class BasicPersonProcessor implements PersonProcessor{
    private readonly personsStore = new Map<number, NoRelationshipsPerson>();
    constructor(protected readonly relationshipsLoader: PersonRelationshipsLoader,
                protected readonly relationshipScanService: PersonRelationshipsResponseDtoScanner,
                protected readonly dtoMapper: PersonDtoMapper,
                protected readonly ripePersonRelationshipsUtil: RipePersonRelationshipsUtil) {
    }

    public static getInstance(relationshipsLoader: PersonRelationshipsLoader = BasicPersonRelationshipsLoader.getInstance(),
                              relationshipsDtoScanner: PersonRelationshipsResponseDtoScanner = BasicPersonRelationshipsResponseDtoScanner.getInstance(),
                              dtoMapper: PersonDtoMapper = PersonDtoMapperImpl.getInstance(),
                              relationshipsUtil: RipePersonRelationshipsUtil = BasicRipePersonRelationshipsUtil.getInstance()): BasicPersonProcessor {
        return new BasicPersonProcessor(relationshipsLoader, relationshipsDtoScanner, dtoMapper, relationshipsUtil);
    }

    clearRawPersonsStorage(): void {
        this.personsStore.clear();
    }

    getRawPersonsStorage(): Map<number, NoRelationshipsPerson> {
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
        const clonedPerson: NoRelationshipsPerson = {...rawPerson};
        // @ts-ignore
        delete clonedPerson['relationshipsInfo'];
        this.personsStore.set(clonedPerson.id, clonedPerson)

        rawPerson.relationshipsInfo.relationships?.forEach(r=>{
            const noRelationsPerson = this.dtoMapper.mapPersonResponseDtoToNoRelationPerson(r.person);
            this.personsStore.set(noRelationsPerson.id, noRelationsPerson);
        })
    }

    private getPersonJurPersonsRelationsIdSet (person: NoRelationshipsPerson, matchList?: Set<number>): Set<number> {
        const resultSet: Set<number> = new Set<number>();

        const ownedJurPersons = person.ownedJurPersons;
        ownedJurPersons.forEach(owned => {
            const benOwner = owned.benOwner;
            if (benOwner&&benOwner.id!==person.id) {
                if (matchList) {
                    if (matchList.has(benOwner.id)) {
                        resultSet.add(benOwner.id)
                    }
                } else resultSet.add(benOwner.id)
            }
        })

        const benOwnedJurPersons = person.benOwnedJurPersons;
        benOwnedJurPersons.forEach(benOwned=>{
            const owner = benOwned.owner;
            if (owner&&owner.id!==person.id) {
                if (matchList) {
                    if (matchList.has(owner.id)) {
                        resultSet.add(owner.id)
                    }
                } else resultSet.add(owner.id)
            }
        })

        return resultSet;
    }

    private async loadPersonsUnloadedJurPersonRelations (persons: Set<NoRelationshipsPerson>, matchList?: Set<number>): Promise<NoRelationshipsOptionalPersonMap> {
        const matchedIds: number[] = []
        persons.forEach(person=>{
            matchedIds.push(...this.getPersonJurPersonsRelationsIdSet(person, matchList))
        })
        const unloadedIds = matchedIds.filter(id=>!this.personsStore.has(id));
        return await this.relationshipsLoader.load(new Set(unloadedIds));
    }

    private savePersonMap (map: NoRelationshipsOptionalPersonMap) {
        [...map].forEach(([id, person])=>{
            if (!person) throw new Error("person was not found "+id)
            this.personsStore.set(id, person);
        })
    }

    private async processJurPersons(personsToProcess: Set<NoRelationshipsPerson>, targetRelationsSet: Set<number>, matchSet?: Set<number>) {
        const jurPersonLoadedRelated = await this.loadPersonsUnloadedJurPersonRelations(personsToProcess, matchSet);
        this.savePersonMap(jurPersonLoadedRelated);

        personsToProcess.forEach(p=>{
            const matchedPersons = this.getPersonJurPersonsRelationsIdSet(p,matchSet);
            matchedPersons.forEach(id=>targetRelationsSet.add(id))
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
        // make method that gon scan shared set for jurpersons
        const iterationPersons: Set<NoRelationshipsPerson> = new Set([...shared].map(s=>checkNotEmpty(this.personsStore.get(s))));

        await this.processJurPersons(iterationPersons, shared, all);

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

        const iterationPersons: Set<NoRelationshipsPerson> = new Set([...all].map(s=>checkNotEmpty(this.personsStore.get(s))));

        await this.processJurPersons(iterationPersons, all);

        return this.buildRipePerson(rawPerson, all);
    }

    private bindJurPerson(jurPerson: JurPerson, createdPersons: Map<number,Person>, personsToInclude: Set<number>) {
        const owner = jurPerson.owner;

        if (owner&&personsToInclude.has(owner.id)) {
            jurPerson.owner = this.getCreatedPerson(owner.id, createdPersons);
        }

        const benOwner = jurPerson.benOwner;
        if (benOwner&&personsToInclude.has(benOwner.id)) {
            jurPerson.benOwner = this.getCreatedPerson(benOwner.id, createdPersons);
        }
    }

    private buildRipePerson (rawPerson: PreProcessedPerson, personsToInclude: Set<number>) {
        const createdPersons: Map<number,Person> = new Map<number,Person>();

        const person: Person = {...rawPerson, relationships: []}
        // @ts-ignore
        delete person['relationshipsInfo']
        createdPersons.set(person.id, person);

        if (rawPerson.relationshipsInfo.relationships) {
            const stack: NestedRelationshipResponseDto[] = []

            rawPerson.relationshipsInfo.relationships.forEach(r=>{
                if (personsToInclude.has(r.person.id)) {
                    const toPerson = this.getCreatedPerson(r.person.id, createdPersons);
                    const rootRelation = this.dtoMapper.mapRelationshipResponseDto(r, toPerson);
                    person.relationships.push(rootRelation);
                    stack.push(r);
                }
            })

            while (stack.length>0) {
                const currentRelationship = stack.pop()!;

                if (currentRelationship.person.relationshipsInfo.relationships) {
                    currentRelationship.person.relationshipsInfo.relationships.forEach(r=>{
                        if (personsToInclude.has(r.person.id)) {
                            const fromPerson = this.getCreatedPerson(currentRelationship.person.id, createdPersons);
                            const toPerson = this.getCreatedPerson(r.person.id, createdPersons);

                            if (fromPerson.relationships.findIndex(rel=>rel.to.id===r.person.id)===-1) {
                                const relationship = this.dtoMapper.mapRelationshipResponseDto(r, toPerson);
                                fromPerson.relationships.push(relationship);
                            }

                            stack.push(r);
                        }
                    })
                }
            }
        }

        createdPersons.forEach(person=>{
            person.ownedJurPersons.forEach(j=>this.bindJurPerson(j, createdPersons, personsToInclude));
        })

        return person;
    }

    private getCreatedPerson(personId: number,createdPersons: Map<number,Person>): Person {
        if (!this.personsStore.has(personId)) throw new Error("person is not loaded: "+personId)
        const person: Person = createdPersons.get(personId)||{...this.personsStore.get(personId)!, relationships: []}
        if (!createdPersons.has(personId)) {
            createdPersons.set(personId, person);
        }
        return person;
    }

}