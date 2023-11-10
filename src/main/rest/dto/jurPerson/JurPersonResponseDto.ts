import {GeoLocation} from "../../../model/GeoLocation";
import {MediaResponseDto} from "../../../model/Media";
import {EmbedPersonResponseDto, RelatedPersonResponseDto} from "../person/PersonResponseDto";

interface JurPersonResponseDto {
    id: number;
    media: MediaResponseDto;
    name: string;
    edrpou: string|null;
    dateOfRegistration: string|null;
    owner: RelatedPersonResponseDto | null;
    benOwner: RelatedPersonResponseDto | null;
    location: GeoLocation | null;
}

export type EmbedJurPersonResponseDto = Omit<JurPersonResponseDto, 'owner'|'benOwner'> & {
    owner: EmbedPersonResponseDto | null,
    benOwner: EmbedPersonResponseDto | null
}

export type MinifiedJurPersonResponseDto = {
    id: number
}
    

export default JurPersonResponseDto;