import {GeoLocation} from "../../../model/GeoLocation";

export default interface JurPersonRequestDto {
    benOwnerId?: string,
    dateOfRegistration?:  string,
    edrpou?:  string,
    name?: string,
    ownerId?: string,
    location?: GeoLocation
}
