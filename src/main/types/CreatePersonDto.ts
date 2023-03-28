import Geo from "./Geo";

type CreatePersonDto = {
    firstName: string;
    middleName: string;
    lastName: string;
    passportNumber?: string;
    passportSerial?: string;
    rnokppCode?: string;
    dateOfBirth?: string;
    place?: Location
}

export default CreatePersonDto;