import Person, {Relationship} from "../../model/human/person/Person";
import {PairedRelationshipsMap, PersonsIdMap, RecursiveScanSource} from "./RelationshipsScanServiceImpl";

export default interface RelationshipsScanService {
    buildPairedRelationshipsMap(sharedPersons: PersonsIdMap): Promise<PairedRelationshipsMap>;
    recursiveScan(person: Person, counter: number, limit: number): PersonsIdMap
}