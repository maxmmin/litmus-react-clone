import {PairedRelationshipMap, PersonStore} from "./BasicPersonRelationshipsAnalyzer";
import Person, {NestedRelationshipsInfo} from "../../model/human/person/Person";

export type AnalyzeResult = {
    processedPerson: Person,
    originalPerson: Person,
    personsStore: PersonStore,
    pairedRelationshipMap: PairedRelationshipMap
}

export default interface PersonRelationshipsAnalyzer {
    getPerson(): Person,

    analyze (): Promise<AnalyzeResult>
}