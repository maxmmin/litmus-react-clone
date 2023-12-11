import {GeoLocation} from "../GeoLocation";
import Person from "../human/person/Person";
import DateEntity from "../DateEntity";
import CoreEntity from "../CoreEntity";
import MediaEntity from "../MediaEntity";
import {RelatedPersonResponseDto} from "../../rest/dto/person/PersonResponseDto";
import SourceContainableEntity from "../SourceContainableEntity";

export interface JurPerson extends CoreEntity, MediaEntity, SourceContainableEntity {
    name: string;
    edrpou: string|null;
    dateOfRegistration: DateEntity|null;
    owner: Person | null;
    benOwner: Person | null;
    location: GeoLocation | null;
}

export type PreProcessedJurPerson = Omit<JurPerson, "owner"|"benOwner"> & {
    owner: RelatedPersonResponseDto | null,
    benOwner: RelatedPersonResponseDto | null
}
