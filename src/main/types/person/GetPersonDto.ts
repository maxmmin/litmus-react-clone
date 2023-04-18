import {Location} from "../Location";
import {PassportData} from "./PassportData";

type GetPersonDto = {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    passportData: PassportData|null;
    dateOfBirth?: string;
    location?: Location
}

export default GetPersonDto;