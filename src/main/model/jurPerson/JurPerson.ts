import {GeoLocation} from "../GeoLocation";
import Person from "../human/person/Person";
import DateEntity from "../DateEntity";
import CoreEntity from "../CoreEntity";

export interface JurPerson extends CoreEntity {
    name: string;
    edrpou: string;
    dateOfRegistration: DateEntity|null;
    owner: Person | null;
    benOwner: Person | null;
    location: GeoLocation | null;
}