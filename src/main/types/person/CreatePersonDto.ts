import Geo from "../Geo";
import {Location} from "../Location";

type CreatePassportDataDto = {
    passportSerial: string|null;
    passportNumber: string|null;
    rnokppCode: string|null;
}

type CreatePersonDto = {
    firstName: string;
    middleName: string;
    lastName: string;
    passportData: CreatePassportDataDto | null;
    dateOfBirth: string | null;
    location: Location | null
}

export default CreatePersonDto;