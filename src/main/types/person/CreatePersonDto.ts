import Geo from "../Geo";
import {Location} from "../Location";

type CreatePersonDto = {
    firstName: string;
    middleName: string;
    lastName: string;
    passportNumber: number | null;
    passportSerial: number | null;
    rnokppCode: number | null;
    dateOfBirth: string | null;
    location: Location | null
}

export default CreatePersonDto;