import {Location} from "../Location";

type GetPersonDto = {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    passportNumber?: number;
    passportSerial?: number;
    rnokppCode?: number;
    dateOfBirth?: string;
    location?: Location
}

export default GetPersonDto;