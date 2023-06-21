import {GeoLocation} from "../GeoLocation";
import Person from "../human/person/Person";
import DateEntity from "../DateEntity";

export type JurPerson = {
    id: string;
    name: string;
    edrpou: string|null;
    dateOfRegistration: DateEntity|null;
    owner: Person | null;
    benOwner: Person | null;
    location: GeoLocation | null;
}