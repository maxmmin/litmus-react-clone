import GetPersonDto from "../person/GetPersonDto";
import {Location} from "../Location";
import {DateEntity} from "../DateEntity";

export type JurPersonCreationData = {
    name: string;
    edrpou: string;
    dateOfRegistration: DateEntity;
    owner: GetPersonDto | null;
    benOwner: GetPersonDto | null;
    location: Location | null
}