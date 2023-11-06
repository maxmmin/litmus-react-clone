import {JurPerson, PreProcessedJurPerson} from "../../model/jurPerson/JurPerson";
import Person, {PreProcessedPerson} from "../../model/human/person/Person";

export default interface JurPersonProcessor {
    bindAll(jurPerson: PreProcessedJurPerson, limitDepth: number): Promise<JurPerson>;
    bindShared(person: PreProcessedJurPerson, limitDepth: number): Promise<JurPerson>;
    clearStorage(): void;
    destroy(jurPerson: JurPerson): void;
}