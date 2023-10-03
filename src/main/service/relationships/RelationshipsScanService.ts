import Person, {Relationship} from "../../model/human/person/Person";
import {PairedRelationshipsMap, PersonsIdMap, RecursiveScanData} from "./RelationshipsScanServiceImpl";

export default interface RelationshipsScanService {
    buildPairedRelationshipsMap(sharedPersons: PersonsIdMap): Promise<PairedRelationshipsMap>;
    recursiveScan(person: Person, scanData: RecursiveScanData, counter: number, limit: number): RecursiveScanData
}