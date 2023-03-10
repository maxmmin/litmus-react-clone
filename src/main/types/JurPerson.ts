import Person from "./Person";

class JurPerson {
    id: number;
    name: string;
    edrpou?: string;
    dateOfRegistration?: Array<number>;
    owner?: Person;
    benOwner?: Person;


    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export default JurPerson;