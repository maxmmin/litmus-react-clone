class Person {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    passportNumber?: number;
    passportSerial?: number;
    rnokppCode?: number;
    dateOfBirth?: number[];
    place?: any


    constructor(id: number,firstName: string, middleName: string, lastName: string) {
        this.id = id;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
    }

}

export default Person;