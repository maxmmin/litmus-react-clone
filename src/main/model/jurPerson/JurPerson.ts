import {GeoLocation} from "../GeoLocation";
import Person from "../human/person/Person";
import DateEntity from "../DateEntity";
import CoreEntity from "../CoreEntity";
import MediaEntity from "../MediaEntity";
import {RelatedPersonResponseDto} from "../../rest/dto/person/PersonResponseDto";
import SourceContainableEntity from "../SourceContainableEntity";
import MetadataContainable, {Metadata} from "../MetadataContainable";

export interface JurPerson extends CoreEntity, MediaEntity, SourceContainableEntity, MetadataContainable {
    name: string;
    edrpou: string|null;
    dateOfRegistration: DateEntity|null;
    owner: Person | null;
    benOwner: Person | null;
    location: GeoLocation | null;
    metadata: Metadata;
}

export type PreProcessedJurPerson = Omit<JurPerson, "owner"|"benOwner"> & {
    owner: RelatedPersonResponseDto | null,
    benOwner: RelatedPersonResponseDto | null,
}
