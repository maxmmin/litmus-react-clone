import Person, {Relationship} from "../../model/human/person/Person";
import {PairedRelationshipsMap, PersonsIdMap, RecursiveScanSource} from "./RelationshipsScanServiceImpl";

export default interface RelationshipsScanService {
    getSharedPersons(person: Person, limit: number): PersonsIdMap;
}