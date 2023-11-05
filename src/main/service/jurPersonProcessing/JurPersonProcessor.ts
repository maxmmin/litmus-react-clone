import {JurPerson, PreProcessedJurPerson} from "../../model/jurPerson/JurPerson";
import Person, {PreProcessedPerson} from "../../model/human/person/Person";

interface JurPersonProcessor {
    bindAll(jurPerson: PreProcessedJurPerson, limitDepth: number): JurPerson;
    bindShared(person: PreProcessedPerson, limitDepth: number): Promise<Person>;
    clearStorage(): void;
    destroy(jurPerson: JurPerson): void;
}