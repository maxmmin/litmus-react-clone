import {GeoLocation} from "../GeoLocation";
import Person from "../human/person/Person";
import DateEntity from "../DateEntity";
import CoreEntity from "../CoreEntity";
import MediaEntity from "../MediaEntity";

export interface JurPerson extends CoreEntity, MediaEntity {
    name: string;
    edrpou: string|null;
    dateOfRegistration: DateEntity|null;
    owner: Person | null;
    benOwner: Person | null;
    location: GeoLocation | null;
}