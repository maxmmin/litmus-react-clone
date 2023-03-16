import GetPersonDto from "./GetPersonDto";
import {Place} from "./Place";

type CreateJurPersonDto = {
    name: string;
    edrpou: string;
    dateOfRegistration: string;
    owner: GetPersonDto | null;
    benOwner: GetPersonDto | null;
    address: Place | null
}

export default CreateJurPersonDto;