type CreatePersonDto = {
    firstName: string;
    middleName: string;
    lastName: string;
    passportNumber?: string;
    passportSerial?: string;
    rnokppCode?: string;
    dateOfBirth?: string;
    place?: any
}

export default CreatePersonDto;