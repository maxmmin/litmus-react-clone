import BasicPersonRelationshipsLoader from "./BasicPersonRelationshipsLoader";
import Person, {RawRelationshipsPerson, Relationship} from "../../model/human/person/Person";
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

    private loadRawPersonToStore(rawPerson: RawRelationshipsPerson) {
        const clonedPerson: NoRelationshipsPerson = {...rawPerson};
        // @ts-ignore
        delete clonedPerson['relationshipsInfo'];
        this.personsStore.set(clonedPerson.id, clonedPerson)

        rawPerson.relationshipsInfo.relationships?.forEach(r=>{
            const noRelationsPerson = this.dtoMapper.mapPersonResponseDtoToNoRelationPerson(r.person);
            this.personsStore.set(noRelationsPerson.id, noRelationsPerson);
        })
    }

    async bindShared (rawPerson: RawRelationshipsPerson, scanDepth: number): Promise<Person> {
        if (scanDepth>rawPerson.relationshipsInfo.scanOptions.depth) {
            throw new Error("scan depth is higher that person scan depth");
        }

        this.loadRawPersonToStore(rawPerson);
        const {shared} = this.relationshipScanService.scan(rawPerson, scanDepth);

        const loadedIdList = [...shared].filter(id=>this.personsStore.has(id));

        loadedIdList.push(rawPerson.id);

        const loadedPersonsMap = await this.relationshipsLoader.loadSharedNestedPersons(rawPerson,scanDepth,new Set(loadedIdList));

        [...loadedPersonsMap].forEach(([id, person])=>{
            if (!person) throw new Error("person was not found "+id)
            this.personsStore.set(id, person);
        })
        return this.buildRipePerson(rawPerson, shared);
    }

    async bindAll (rawPerson: RawRelationshipsPerson, scanDepth: number): Promise<Person> {
        if (scanDepth>rawPerson.relationshipsInfo.scanOptions.depth) {
            throw new Error("scan depth is higher that person scan depth");
        }

        this.loadRawPersonToStore(rawPerson);
        const {all} = this.relationshipScanService.scan(rawPerson, scanDepth);

        const loadedIdList = [...all].filter(id=>this.personsStore.has(id));

        loadedIdList.push(rawPerson.id);

        const loadedPersonsMap = await this.relationshipsLoader.loadAllNestedPersons(rawPerson,scanDepth,new Set(loadedIdList));

        [...loadedPersonsMap].forEach(([id, person])=>{
            if (!person) throw new Error("person was not found "+id)
            this.personsStore.set(id, person);
        })

        return this.buildRipePerson(rawPerson, all);
    }

    private buildRipePerson (rawPerson: RawRelationshipsPerson, personsToInclude: Set<number>) {
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