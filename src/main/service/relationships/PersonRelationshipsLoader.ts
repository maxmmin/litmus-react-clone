import {RawRelationshipsPerson} from "../../model/human/person/Person";
import {NoRelationshipsOptionalPersonMap} from "./BasicPersonRelationshipsLoader";

export default interface PersonRelationshipsLoader {
    loadSharedNestedPersons(person: RawRelationshipsPerson, limit: number, excludedIdSet: Set<number>): Promise<NoRelationshipsOptionalPersonMap>;
    loadAllNestedPersons(person: RawRelationshipsPerson, limit: number, excludedIdSet: Set<number>): Promise<NoRelationshipsOptionalPersonMap>;
}