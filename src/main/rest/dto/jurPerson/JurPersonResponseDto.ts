import Person from "../../../model/human/person/Person";
import {GeoLocation} from "../../../model/GeoLocation";
import Media, {MediaResponseDto} from "../../../model/Media";
import {NoRelationshipsPerson} from "../../../redux/types/creation/PersonCreationState";
import {NoRelationshipsPersonResponseDto, SimplePersonResponseDto} from "../person/PersonResponseDto";

interface JurPersonResponseDto {
    id: number;
    media: MediaResponseDto;
    name: string;
    edrpou: string|null;
    dateOfRegistration: string;
    owner: SimplePersonResponseDto | null;
    benOwner: SimplePersonResponseDto | null;
    location: GeoLocation | null;
}

export default JurPersonResponseDto;