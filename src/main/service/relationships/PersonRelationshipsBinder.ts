import Person, {RawRelationshipsPerson} from "../../model/human/person/Person";
import {NoRelationshipsPerson} from "../../redux/types/creation/PersonCreationState";

export default interface PersonRelationshipsBinder {
    bindAll(person: RawRelationshipsPerson, limitDepth: number): Promise<Person>;
    bindShared(person: RawRelationshipsPerson, limitDepth: number): Promise<Person>;
    getRawPersonsStorage(): Map<number, NoRelationshipsPerson>;
    clearRawPersonsStorage(): void;
    // need to be called to remove circular dependencies
    destroy(person: Person): void;
}