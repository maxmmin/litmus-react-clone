import GetPersonDto from "./GetPersonDto";
import {Location} from "./Location";

type CreateJurPersonDto = {
    name: string;
    edrpou: string;
    dateOfRegistration: string;
    owner: GetPersonDto | null;
    benOwner: GetPersonDto | null;
    address: Location | null
}

export default CreateJurPersonDto;