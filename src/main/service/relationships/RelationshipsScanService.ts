import Person from "../../model/human/person/Person";
import {NestedPersonsIdMap} from "./RelationshipsScanServiceImpl";

export default interface RelationshipsScanService {
    getRelatedPersons(person: Person, limit: number): Set<Person>;
    // pass -1 to disable limit
    getSharedPersons(person: Person, limit: number): NestedPersonsIdMap;
}