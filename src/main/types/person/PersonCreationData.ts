import Geo from "../Geo";
import {DateEntity} from "../DateEntity";

type PersonCreationData = {
    firstName: string;
    middleName: string;
    lastName: string;
    passportNumber?: string;
    passportSerial?: string;
    rnokppCode?: string;
    dateOfBirth?: DateEntity;
    location?: Location | null
}

export default PersonCreationData;