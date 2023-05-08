import {Location} from "./Location";
import {PassportData} from "./PassportData";
import DateEntity from "./DateEntity";
import Sex from "./Sex";

type Person = {
    id?: string;
    firstName: string;
    middleName: string;
    lastName: string;
    relationships: Array<Relationship>,
    sex: Sex | null;
    passportData: PassportData | null;
    dateOfBirth: DateEntity;
    location: Location | null
}

export const getFullName = (person: Person) => {
    return `${person.lastName} ${person.firstName} ${person.middleName}`
}

export type Relationship ={
    person: Person,
    relationType: RelationType | null,
    note: string
}

export enum RelationType {
    PARENT="RELATIVE", SPOUSE="SPOUSE", SIBLING="SIBLING", RELATIVE="RELATIVE", FRIEND="FRIEND"
}



export default Person;