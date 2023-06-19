import Person from "../../../model/human/person/Person";
import {Location} from "../../../model/Location";

interface JurPersonResponseDto {
    id: string;
    name: string;
    edrpou?: string;
    dateOfRegistration?: string;
    owner?: Person | null;
    benOwner?: Person | null;
    location?: Location | null;
}

export default JurPersonResponseDto;