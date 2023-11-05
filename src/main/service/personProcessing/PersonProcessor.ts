import Person, {NoRelationsPerson, PreProcessedPerson} from "../../model/human/person/Person";

export default interface PersonProcessor {
    bindAll(person: PreProcessedPerson, limitDepth: number): Promise<Person>;
    bindShared(person: PreProcessedPerson, limitDepth: number): Promise<Person>;
    getPersonsStorage(): Map<number, NoRelationsPerson>;
    clearPersonsStorage(): void;
    // need to be called to remove circular dependencies and give possibility for junk cleaner to clear memory
    destroy(person: Person): void;
}