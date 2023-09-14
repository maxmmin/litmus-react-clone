import Person from "../../../model/human/person/Person";
import {GeoLocation} from "../../../model/GeoLocation";

interface JurPersonResponseDto {
    id: number;
    name: string;
    edrpou?: string;
    dateOfRegistration?: string;
    owner?: Person | null;
    benOwner?: Person | null;
    location?: GeoLocation | null;
}

export default JurPersonResponseDto;