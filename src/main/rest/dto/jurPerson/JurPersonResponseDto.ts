import Person from "../../../model/human/person/Person";
import {GeoLocation} from "../../../model/GeoLocation";
import Media from "../../../model/Media";

interface JurPersonResponseDto {
    id: number;
    media: Media;
    name: string;
    edrpou?: string;
    dateOfRegistration?: string;
    owner?: Person | null;
    benOwner?: Person | null;
    location?: GeoLocation | null;
}

export default JurPersonResponseDto;