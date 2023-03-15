import GetPersonDto from "./GetPersonDto";

type CreateJurPersonDto = {
    name: string;
    edrpou: string;
    dateOfRegistration: string;
    owner: GetPersonDto | null;
    benOwner: GetPersonDto | null;
}

export default CreateJurPersonDto;