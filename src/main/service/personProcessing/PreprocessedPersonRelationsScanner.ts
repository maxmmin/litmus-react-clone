import {PreProcessedPerson} from "../../model/human/person/Person";

export type ScanResult = {shared: Set<number>, all: Set<number>}

export default interface PreprocessedPersonRelationsScanner {
    scan(person: PreProcessedPerson, limit: number): {shared: Set<number>, all: Set<number>}
}