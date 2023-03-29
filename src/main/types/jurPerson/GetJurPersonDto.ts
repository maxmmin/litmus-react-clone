import GetPersonDto from "../person/GetPersonDto";

type GetJurPersonDto = {
    id: number;
    name: string;
    edrpou?: string;
    dateOfRegistration?: Array<number>;
    owner?: GetPersonDto;
    benOwner?: GetPersonDto;
}

export default GetJurPersonDto;