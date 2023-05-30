import {Location} from "../Location";
import Person from "../person/Person";
import DateEntity from "../DateEntity";

export type JurPerson = {
    id?: string;
    name: string;
    edrpou: string;
    dateOfRegistration: DateEntity;
    owner: Person | null;
    benOwner: Person | null;
    location: Location | null;
}