import Geo from "../Geo";
import {DateEntity} from "../DateEntity";
import {Location} from "../Location";
import {PassportData} from "./PassportData";

type PersonCreationData = {
    firstName: string;
    middleName: string;
    lastName: string;
    passportData: PassportData;
    dateOfBirth?: DateEntity;
    location?: Location | null
}

export default PersonCreationData;