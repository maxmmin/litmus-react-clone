import Person from "../../../model/human/person/Person";
import {GeoLocation} from "../../../model/GeoLocation";
import Media, {MediaResponseDto} from "../../../model/Media";

interface JurPersonResponseDto {
    id: number;
    media: MediaResponseDto;
    name: string;
    edrpou: string|null;
    dateOfRegistration: string;
    owner: Person | null;
    benOwner: Person | null;
    location: GeoLocation | null;
}

export default JurPersonResponseDto;