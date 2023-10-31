import Person, {NoRelationsPerson, PreProcessedPerson} from "../../model/human/person/Person";

export default interface PersonProcessor {
    bindAll(person: PreProcessedPerson, limitDepth: number): Promise<Person>;
    bindShared(person: PreProcessedPerson, limitDepth: number): Promise<Person>;
    getRawPersonsStorage(): Map<number, NoRelationsPerson>;
    clearRawPersonsStorage(): void;
    // need to be called to remove circular dependencies
    destroy(person: Person): void;
}