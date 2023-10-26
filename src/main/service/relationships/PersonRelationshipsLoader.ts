import {PreProcessedPerson} from "../../model/human/person/Person";
import {NoRelationshipsOptionalPersonMap} from "./BasicPersonRelationshipsLoader";

export default interface PersonRelationshipsLoader {
    loadSharedNestedPersons(person: PreProcessedPerson, limit: number, excludedIdSet: Set<number>): Promise<NoRelationshipsOptionalPersonMap>;
    loadAllNestedPersons(person: PreProcessedPerson, limit: number, excludedIdSet: Set<number>): Promise<NoRelationshipsOptionalPersonMap>;
    load (idSet: Set<number>): Promise<NoRelationshipsOptionalPersonMap>;
}