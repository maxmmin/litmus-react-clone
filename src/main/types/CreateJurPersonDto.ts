import getPersonDto from "./GetPersonDto";

type CreateJurPersonDto = {
    name: string;
    edrpou?: string;
    dateOfRegistration?: string;
    owner?: getPersonDto;
    benOwner?: getPersonDto;
}

export default CreateJurPersonDto;