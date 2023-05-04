import {Location} from "./Location";
import {PassportData} from "./PassportData";
import DateEntity from "./DateEntity";
import Sex from "./Sex";

type Person = {
    id?: string;
    firstName: string;
    middleName: string;
    lastName: string;
    father: Person|null;
    mother: Person|null;
    spouse: Person|null;
    relatives: Array<Person>;
    siblings: Array<Person>;
    friends: Array<Person>;
    sex: Sex | null;
    passportData: PassportData | null;
    dateOfBirth: DateEntity;
    location: Location | null
}



export default Person;