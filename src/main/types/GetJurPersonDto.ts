import getPersonDto from "./GetPersonDto";

type getJurPersonDto = {
    id: number;
    name: string;
    edrpou?: string;
    dateOfRegistration?: Array<number>;
    owner?: getPersonDto;
    benOwner?: getPersonDto;
}

export default getJurPersonDto;