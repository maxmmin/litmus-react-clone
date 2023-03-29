type GetPersonDto = {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    passportNumber?: number;
    passportSerial?: number;
    rnokppCode?: number;
    dateOfBirth?: number[];
    place?: any
}

export default GetPersonDto;