import {Location} from "./Location";
import {PassportData} from "./PassportData";
import DateEntity from "./DateEntity";
import Sex from "./Sex";

type Person = {
    id?: string;
    firstName: string;
    middleName: string;
    lastName: string;
    sex: Sex | null;
    passportData: PassportData | null;
    dateOfBirth: DateEntity;
    location: Location | null
}



export default Person;