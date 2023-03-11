type CreatePersonDto = {
    firstName: string;
    middleName: string;
    lastName: string;
    passportNumber?: number;
    passportSerial?: number;
    rnokppCode?: number;
    dateOfBirth?: string;
    place?: any
}

export default CreatePersonDto;