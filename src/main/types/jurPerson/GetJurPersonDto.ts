import GetPersonDto from "../person/GetPersonDto";
import {Location} from "../Location";

type GetJurPersonDto = {
    id: number;
    name: string;
    edrpou?: string;
    dateOfRegistration?: Array<number>;
    owner?: GetPersonDto;
    benOwner?: GetPersonDto;
    location?: Location;
}

export default GetJurPersonDto;