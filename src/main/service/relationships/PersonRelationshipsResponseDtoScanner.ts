import {RawRelationshipsPerson} from "../../model/human/person/Person";

export type ScanResult = {shared: Set<number>, all: Set<number>}

export default interface PersonRelationshipsResponseDtoScanner {
    scan(person: RawRelationshipsPerson, limit: number): {shared: Set<number>, all: Set<number>}
}