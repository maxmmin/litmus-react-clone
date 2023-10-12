import BasicPersonRelationshipsLoader from "./BasicPersonRelationshipsLoader";
import Person, {RawRelationshipsPerson} from "../../../model/human/person/Person";
import BasicRelationshipsResponseDtoScanner from "./BasicRelationshipsResponseDtoScanner";
import {NoRelationshipsPerson} from "../../../redux/types/creation/PersonCreationState";
import {
    NestedRelationshipResponseDto
} from "../../../rest/dto/person/PersonResponseDto";
import PersonDtoMapper from "../../../rest/dto/dtoMappers/PersonDtoMapper";

export default class BasicPersonRelationshipsBinder {
    private readonly personsStore = new Map<number, NoRelationshipsPerson>();
    constructor(protected readonly relationshipsLoader: BasicPersonRelationshipsLoader,
                protected readonly relationshipScanService: BasicRelationshipsResponseDtoScanner,
                protected readonly dtoMapper: PersonDtoMapper) {
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

    async bindShared (rawPerson: RawRelationshipsPerson, scanDepth: number) {
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

    bindAll (rawPerson: RawRelationshipsPerson, scanDepth: number) {
        if (rawPerson.relationshipsInfo.scanOptions.depth) {
            throw new Error("scan depth is higher that person scan depth");
        }

        this.loadRawPersonToStore(rawPerson);

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

    // private buildRipeRelationship(nestedRelationship: NestedRelationshipResponseDto, personsToInclude: Set<number>, createdPersons: Map<number,Person>): Relationship {
    //     if (!this.personsStore.has(nestedRelationship.person.id)) {
    //         throw new Error("such person is not present in store "+nestedRelationship.person.id)
    //     }
    //     const storedPerson: NoRelationshipsPerson = this.personsStore.get(nestedRelationship.person.id)!;
    //
    //     const person: Person = {...storedPerson}
    //
    //     personnestedRelationship.person.relationshipsInfo.
    // }
}