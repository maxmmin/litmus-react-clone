import GetPersonDto from "../person/GetPersonDto";
import {Location} from "../Location";

type CreateJurPersonDto = {
    name: string;
    edrpou: string | null;
    dateOfRegistration: string | null;
    ownerId: number | null;
    benOwnerId: number | null;
    location: Location | null
}

export default CreateJurPersonDto;