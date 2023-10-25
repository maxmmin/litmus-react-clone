import {GeoLocation} from "../../../model/GeoLocation";
import MediaEntity from "../../../model/MediaEntity";

export default interface JurPersonRequestDto extends Partial<MediaEntity> {
    benOwnerId?: number,
    dateOfRegistration?:  string,
    edrpou?:  string,
    name?: string,
    ownerId?: number,
    location?: GeoLocation
}
