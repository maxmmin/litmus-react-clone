import {PersonStore} from "./BasicPersonRelationshipsAnalyzer";
import Person, {NestedRelationshipsInfo} from "../../model/human/person/Person";

export type AnalyzeResult = {
    analyzedPerson: Person,
    relatedPersonsStore: PersonStore,
    filteredRelationshipsInfo: NestedRelationshipsInfo

}
export default interface PersonRelationshipsAnalyzer {
    getPerson(): Person,
    analyze (): Promise<AnalyzeResult>
}