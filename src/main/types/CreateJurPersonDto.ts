import GetPersonDto from "./GetPersonDto";

type CreateJurPersonDto = {
    name: string;
    edrpou?: string;
    dateOfRegistration?: string;
    owner?: GetPersonDto;
    benOwner?: GetPersonDto;
}

export default CreateJurPersonDto;