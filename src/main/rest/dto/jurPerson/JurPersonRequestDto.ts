import {GeoLocation} from "../../../model/GeoLocation";

export default interface JurPersonRequestDto {
    benOwnerId?: number,
    dateOfRegistration?:  string,
    edrpou?:  string,
    name?: string,
    ownerId?: number,
    location?: GeoLocation
}
