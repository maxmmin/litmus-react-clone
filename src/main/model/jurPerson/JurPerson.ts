import {GeoLocation} from "../GeoLocation";
import Person, {PreProcessedPerson} from "../human/person/Person";
import DateEntity from "../DateEntity";
import CoreEntity from "../CoreEntity";
import MediaEntity from "../MediaEntity";
import {NoRelationshipsPerson} from "../../redux/types/creation/PersonCreationState";
import {EmbedJurPersonResponseDto} from "../../rest/dto/jurPerson/JurPersonResponseDto";
import {EmbedPersonResponseDto, RelatedPersonResponseDto} from "../../rest/dto/person/PersonResponseDto";

export interface JurPerson extends CoreEntity, MediaEntity {
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

export type PreProcessedEmbedJurPerson = Omit<JurPerson, "owner"|"benOwner"> & {
    owner: EmbedPersonResponseDto | null,
    benOwner: EmbedPersonResponseDto | null
}