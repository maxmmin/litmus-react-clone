import {Location} from "./Location";
import {PassportData} from "./PassportData";
import DateEntity from "./DateEntity";

type Person = {
    id?: string;
    firstName: string;
    middleName: string;
    lastName: string;
    passportData: PassportData | null;
    dateOfBirth: DateEntity;
    location: Location | null
}



export default Person;