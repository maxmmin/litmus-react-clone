import Person, {PreProcessedPerson} from "../../model/human/person/Person";
import {NoRelationshipsPerson} from "../../redux/types/creation/PersonCreationState";

export default interface PersonProcessor {
    bindAll(person: PreProcessedPerson, limitDepth: number): Promise<Person>;
    bindShared(person: PreProcessedPerson, limitDepth: number): Promise<Person>;
    getRawPersonsStorage(): Map<number, NoRelationshipsPerson>;
    clearRawPersonsStorage(): void;
    // need to be called to remove circular dependencies
    destroy(person: Person): void;
}