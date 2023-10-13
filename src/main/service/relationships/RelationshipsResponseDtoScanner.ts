import {RawRelationshipsPerson} from "../../model/human/person/Person";

export type ScanResult = {shared: Set<number>, all: Set<number>}

export default interface RelationshipsResponseDtoScanner {
    scan(person: RawRelationshipsPerson, limit: number): {shared: Set<number>, all: Set<number>}
}