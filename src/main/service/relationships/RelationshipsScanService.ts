import Person from "../../model/human/person/Person";
import {NestedPersonsIdMap} from "./RelationshipsScanServiceImpl";

export default interface RelationshipsScanService {
    // pass -1 to disable limit
    getSharedPersons(person: Person, limit: number): NestedPersonsIdMap;
}