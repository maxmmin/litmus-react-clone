import {GeoLocation} from "../../../model/GeoLocation";
import {MediaResponseDto} from "../../../model/Media";
import {EmbedPersonResponseDto, RelatedPersonResponseDto} from "../person/PersonResponseDto";
import MetadataContainableResponseDto from "../MetadataContainableResponseDto";

interface JurPersonResponseDto extends MetadataContainableResponseDto {
    id: number;
    media: MediaResponseDto;
    name: string;
    edrpou: string|null;
    dateOfRegistration: string|null;
    owner: RelatedPersonResponseDto | null;
    benOwner: RelatedPersonResponseDto | null;
    location: GeoLocation | null;
    sources: string[]
}

export type EmbedJurPersonResponseDto = Omit<JurPersonResponseDto, 'owner'|'benOwner'|'metadata'> & {
    owner: EmbedPersonResponseDto | null,
    benOwner: EmbedPersonResponseDto | null
}

export type MinifiedJurPersonResponseDto = {
    id: number
}
    

export default JurPersonResponseDto;